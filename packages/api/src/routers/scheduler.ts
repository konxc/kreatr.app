import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'

export const schedulerRouter = router({
  // Get scheduled posts for calendar view
  getScheduled: protectedProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
        workspaceId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { startDate, endDate, workspaceId } = input

      const where: any = {
        authorId: ctx.session.user.id,
        status: 'SCHEDULED',
        scheduledAt: {
          gte: startDate,
          lte: endDate,
        },
      }

      if (workspaceId) {
        where.workspaceId = workspaceId
      }

      const scheduled = await ctx.prisma.content.findMany({
        where,
        include: {
          posts: {
            include: {
              account: true,
            },
          },
          workspace: true,
        },
        orderBy: {
          scheduledAt: 'asc',
        },
      })

      return scheduled
    }),

  // Schedule a post
  schedulePost: protectedProcedure
    .input(
      z.object({
        contentId: z.string(),
        scheduledAt: z.date(),
        platforms: z.array(
          z.enum(['TIKTOK', 'INSTAGRAM', 'TWITTER'])
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { contentId, scheduledAt, platforms } = input

      // Verify content ownership
      const content = await ctx.prisma.content.findUnique({
        where: { id: contentId },
        include: {
          workspace: {
            include: {
              members: true,
            },
          },
        },
      })

      if (!content) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Content not found',
        })
      }

      // Check if user has access
      const hasAccess = content.workspace.members.some(
        (member) => member.userId === ctx.session.user.id
      )

      if (!hasAccess) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have access to this content',
        })
      }

      // Check if scheduled time is in the future
      if (scheduledAt <= new Date()) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Scheduled time must be in the future',
        })
      }

      // Update content status
      const updated = await ctx.prisma.content.update({
        where: { id: contentId },
        data: {
          status: 'SCHEDULED',
          scheduledAt,
        },
      })

      // Create post entries for each platform
      const socialAccounts = await ctx.prisma.socialAccount.findMany({
        where: {
          workspaceId: content.workspaceId,
          platform: {
            in: platforms,
          },
          isActive: true,
        },
      })

      if (socialAccounts.length === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No active social accounts found for selected platforms',
        })
      }

      // Create posts for each platform
      await Promise.all(
        socialAccounts.map((account) =>
          ctx.prisma.post.create({
            data: {
              contentId: content.id,
              accountId: account.id,
              platform: account.platform,
              status: 'SCHEDULED',
            },
          })
        )
      )

      return {
        success: true,
        content: updated,
        platformsScheduled: socialAccounts.length,
      }
    }),

  // Reschedule a post (drag & drop)
  reschedulePost: protectedProcedure
    .input(
      z.object({
        contentId: z.string(),
        newScheduledAt: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { contentId, newScheduledAt } = input

      // Verify ownership
      const content = await ctx.prisma.content.findUnique({
        where: { id: contentId },
        include: {
          workspace: {
            include: {
              members: true,
            },
          },
        },
      })

      if (!content) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Content not found',
        })
      }

      const hasAccess = content.workspace.members.some(
        (member) => member.userId === ctx.session.user.id
      )

      if (!hasAccess) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have access to this content',
        })
      }

      // Update scheduled time
      const updated = await ctx.prisma.content.update({
        where: { id: contentId },
        data: {
          scheduledAt: newScheduledAt,
        },
      })

      return {
        success: true,
        content: updated,
      }
    }),

  // Cancel scheduled post
  cancelScheduled: protectedProcedure
    .input(
      z.object({
        contentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { contentId } = input

      // Verify ownership
      const content = await ctx.prisma.content.findUnique({
        where: { id: contentId },
        include: {
          workspace: {
            include: {
              members: true,
            },
          },
          posts: true,
        },
      })

      if (!content) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Content not found',
        })
      }

      const hasAccess = content.workspace.members.some(
        (member) => member.userId === ctx.session.user.id
      )

      if (!hasAccess) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have access to this content',
        })
      }

      // Update content status back to draft
      const updated = await ctx.prisma.content.update({
        where: { id: contentId },
        data: {
          status: 'DRAFT',
          scheduledAt: null,
        },
      })

      // Delete scheduled posts
      await ctx.prisma.post.deleteMany({
        where: {
          contentId: content.id,
          status: 'SCHEDULED',
        },
      })

      return {
        success: true,
        content: updated,
      }
    }),

  // Get queue status
  getQueueStatus: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date()
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    const upcoming = await ctx.prisma.content.count({
      where: {
        authorId: ctx.session.user.id,
        status: 'SCHEDULED',
        scheduledAt: {
          gte: now,
          lte: next24Hours,
        },
      },
    })

    const total = await ctx.prisma.content.count({
      where: {
        authorId: ctx.session.user.id,
        status: 'SCHEDULED',
      },
    })

    const nextPost = await ctx.prisma.content.findFirst({
      where: {
        authorId: ctx.session.user.id,
        status: 'SCHEDULED',
        scheduledAt: {
          gte: now,
        },
      },
      orderBy: {
        scheduledAt: 'asc',
      },
      include: {
        posts: {
          include: {
            account: true,
          },
        },
      },
    })

    return {
      upcoming,
      total,
      nextPost,
    }
  }),

  // Get posting history
  getHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, offset } = input

      const history = await ctx.prisma.content.findMany({
        where: {
          authorId: ctx.session.user.id,
          status: 'PUBLISHED',
        },
        include: {
          posts: {
            include: {
              account: true,
            },
          },
        },
        orderBy: {
          publishedAt: 'desc',
        },
        take: limit,
        skip: offset,
      })

      const total = await ctx.prisma.content.count({
        where: {
          authorId: ctx.session.user.id,
          status: 'PUBLISHED',
        },
      })

      return {
        history,
        total,
        hasMore: offset + limit < total,
      }
    }),
})
