import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { Platform, PostStatus } from '@kreatr/database'

export const schedulerRouter = createTRPCRouter({
  // Schedule a post
  schedulePost: protectedProcedure
    .input(
      z.object({
        contentId: z.string(),
        platform: z.nativeEnum(Platform),
        accountId: z.string(),
        scheduledAt: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify user has access to content and account
      const content = await ctx.db.content.findFirst({
        where: {
          id: input.contentId,
          workspace: {
            members: {
              some: {
                userId: ctx.session.user.id,
              },
            },
          },
        },
      })

      if (!content) {
        throw new Error('Content not found or access denied')
      }

      const account = await ctx.db.socialAccount.findFirst({
        where: {
          id: input.accountId,
          workspace: {
            members: {
              some: {
                userId: ctx.session.user.id,
              },
            },
          },
        },
      })

      if (!account) {
        throw new Error('Social account not found or access denied')
      }

      // Create scheduled post
      const post = await ctx.db.post.create({
        data: {
          platform: input.platform,
          status: PostStatus.SCHEDULED,
          contentId: input.contentId,
          accountId: input.accountId,
        },
      })

      // Update content scheduled time
      await ctx.db.content.update({
        where: { id: input.contentId },
        data: {
          scheduledAt: input.scheduledAt,
          status: 'SCHEDULED',
        },
      })

      return post
    }),

  // Get scheduled posts
  getScheduled: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        platform: z.nativeEnum(Platform).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const whereClause: any = {
        content: {
          workspace: {
            id: input.workspaceId,
            members: {
              some: {
                userId: ctx.session.user.id,
              },
            },
          },
        },
        status: PostStatus.SCHEDULED,
      }

      if (input.platform) {
        whereClause.platform = input.platform
      }

      if (input.startDate || input.endDate) {
        whereClause.content = {
          ...whereClause.content,
          scheduledAt: {},
        }

        if (input.startDate) {
          whereClause.content.scheduledAt.gte = input.startDate
        }

        if (input.endDate) {
          whereClause.content.scheduledAt.lte = input.endDate
        }
      }

      return ctx.db.post.findMany({
        where: whereClause,
        include: {
          content: {
            select: {
              id: true,
              title: true,
              caption: true,
              hashtags: true,
              mediaUrls: true,
              scheduledAt: true,
            },
          },
          account: {
            select: {
              id: true,
              platform: true,
              username: true,
              displayName: true,
            },
          },
        },
        orderBy: {
          content: {
            scheduledAt: 'asc',
          },
        },
      })
    }),

  // Cancel scheduled post
  cancelScheduled: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findFirst({
        where: {
          id: input.postId,
          content: {
            workspace: {
              members: {
                some: {
                  userId: ctx.session.user.id,
                },
              },
            },
          },
        },
        include: {
          content: true,
        },
      })

      if (!post) {
        throw new Error('Post not found or access denied')
      }

      if (post.status !== PostStatus.SCHEDULED) {
        throw new Error('Post is not scheduled')
      }

      // Delete the post
      await ctx.db.post.delete({
        where: { id: input.postId },
      })

      // Update content status back to draft
      await ctx.db.content.update({
        where: { id: post.contentId },
        data: {
          status: 'DRAFT',
          scheduledAt: null,
        },
      })

      return { success: true }
    }),

  // Get calendar view data
  getCalendarData: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        month: z.number().min(1).max(12),
        year: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const startDate = new Date(input.year, input.month - 1, 1)
      const endDate = new Date(input.year, input.month, 0, 23, 59, 59)

      const posts = await ctx.db.post.findMany({
        where: {
          content: {
            workspace: {
              id: input.workspaceId,
              members: {
                some: {
                  userId: ctx.session.user.id,
                },
              },
            },
            scheduledAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
        include: {
          content: {
            select: {
              id: true,
              title: true,
              scheduledAt: true,
            },
          },
          account: {
            select: {
              platform: true,
              username: true,
            },
          },
        },
        orderBy: {
          content: {
            scheduledAt: 'asc',
          },
        },
      })

      // Group by date
      const calendarData = posts.reduce((acc, post) => {
        if (!post.content.scheduledAt) return acc

        const dateKey = post.content.scheduledAt.toISOString().split('T')[0]
        if (!acc[dateKey]) {
          acc[dateKey] = []
        }

        acc[dateKey].push({
          id: post.id,
          title: post.content.title,
          platform: post.account.platform,
          username: post.account.username,
          time: post.content.scheduledAt.toISOString(),
          status: post.status,
        })

        return acc
      }, {} as Record<string, any[]>)

      return calendarData
    }),
})