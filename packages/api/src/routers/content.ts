import { router, protectedProcedure, workspaceProcedure } from '../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { ContentStatus } from '@kreatr/database'

export const contentRouter = router({
  // Generate content ideas using AI
  generateIdeas: workspaceProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        topic: z.string().min(3),
        platform: z.enum(['TIKTOK', 'INSTAGRAM', 'TWITTER']),
        count: z.number().min(1).max(20).default(10),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check user credits
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { creditBalance: true },
      })

      const creditCost = input.count * 2 // 2 credits per idea

      if (!user || user.creditBalance < creditCost) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Insufficient credits',
        })
      }

      // TODO: Call AI service to generate ideas
      // For now, return mock data
      const ideas = Array.from({ length: input.count }, (_, i) => ({
        title: `${input.topic} - Idea ${i + 1}`,
        description: `Content idea about ${input.topic} for ${input.platform}`,
        hashtags: ['#content', '#creator', '#viral'],
      }))

      // Deduct credits
      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { creditBalance: { decrement: creditCost } },
      })

      // Log credit transaction
      await ctx.prisma.creditTransaction.create({
        data: {
          userId: ctx.session.user.id,
          amount: -creditCost,
          type: 'USAGE',
          description: `Generated ${input.count} content ideas`,
          balance: user.creditBalance - creditCost,
        },
      })

      return { ideas, creditsUsed: creditCost }
    }),

  // Generate caption for content
  generateCaption: workspaceProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        idea: z.string(),
        tone: z.enum(['casual', 'professional', 'funny', 'inspirational']),
        length: z.enum(['short', 'medium', 'long']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check credits
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { creditBalance: true },
      })

      const creditCost = 5

      if (!user || user.creditBalance < creditCost) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Insufficient credits',
        })
      }

      // TODO: Call AI service to generate caption
      const caption = `This is a ${input.tone} caption about: ${input.idea}`
      const hashtags = ['#content', '#creator', '#socialmedia']

      // Deduct credits
      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { creditBalance: { decrement: creditCost } },
      })

      await ctx.prisma.creditTransaction.create({
        data: {
          userId: ctx.session.user.id,
          amount: -creditCost,
          type: 'USAGE',
          description: 'Generated caption',
          balance: user.creditBalance - creditCost,
        },
      })

      return { caption, hashtags, creditsUsed: creditCost }
    }),

  // Create content
  create: workspaceProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        title: z.string().min(1),
        caption: z.string().optional(),
        hashtags: z.array(z.string()).optional(),
        mediaUrls: z.array(z.string().url()).optional(),
        aiGenerated: z.boolean().default(false),
        aiPrompt: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const content = await ctx.prisma.content.create({
        data: {
          title: input.title,
          caption: input.caption,
          hashtags: input.hashtags || [],
          mediaUrls: input.mediaUrls || [],
          aiGenerated: input.aiGenerated,
          aiPrompt: input.aiPrompt,
          authorId: ctx.session.user.id,
          workspaceId: input.workspaceId,
          status: 'DRAFT',
        },
      })

      return content
    }),

  // Get all content in workspace
  getAll: workspaceProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        status: z.nativeEnum(ContentStatus).optional(),
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const contents = await ctx.prisma.content.findMany({
        where: {
          workspaceId: input.workspaceId,
          status: input.status,
        },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          posts: {
            select: {
              id: true,
              platform: true,
              status: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      })

      let nextCursor: string | undefined = undefined
      if (contents.length > input.limit) {
        const nextItem = contents.pop()
        nextCursor = nextItem?.id
      }

      return {
        contents,
        nextCursor,
      }
    }),

  // Get single content
  getById: workspaceProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        contentId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const content = await ctx.prisma.content.findFirst({
        where: {
          id: input.contentId,
          workspaceId: input.workspaceId,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          posts: {
            include: {
              account: {
                select: {
                  platform: true,
                  username: true,
                },
              },
            },
          },
          comments: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      })

      if (!content) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Content not found',
        })
      }

      return content
    }),

  // Update content
  update: workspaceProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        contentId: z.string(),
        title: z.string().min(1).optional(),
        caption: z.string().optional(),
        hashtags: z.array(z.string()).optional(),
        mediaUrls: z.array(z.string().url()).optional(),
        status: z.nativeEnum(ContentStatus).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { workspaceId, contentId, ...data } = input

      const content = await ctx.prisma.content.updateMany({
        where: {
          id: contentId,
          workspaceId,
        },
        data,
      })

      if (content.count === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Content not found',
        })
      }

      return { success: true }
    }),

  // Delete content
  delete: workspaceProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        contentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const content = await ctx.prisma.content.deleteMany({
        where: {
          id: input.contentId,
          workspaceId: input.workspaceId,
        },
      })

      if (content.count === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Content not found',
        })
      }

      return { success: true }
    }),

  // Add comment to content
  addComment: workspaceProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        contentId: z.string(),
        text: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify content exists in workspace
      const content = await ctx.prisma.content.findFirst({
        where: {
          id: input.contentId,
          workspaceId: input.workspaceId,
        },
      })

      if (!content) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Content not found',
        })
      }

      const comment = await ctx.prisma.comment.create({
        data: {
          text: input.text,
          authorId: ctx.session.user.id,
          contentId: input.contentId,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      })

      return comment
    }),
})
