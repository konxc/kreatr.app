import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { Platform } from '@kreatr/database'

export const analyticsRouter = createTRPCRouter({
  // Get workspace overview analytics
  getWorkspaceOverview: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        timeRange: z.enum(['7d', '30d', '90d']).default('30d'),
      })
    )
    .query(async ({ ctx, input }) => {
      const days = input.timeRange === '7d' ? 7 : input.timeRange === '30d' ? 30 : 90
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      // Get total posts in time range
      const totalPosts = await ctx.db.post.count({
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
          },
          publishedAt: {
            gte: startDate,
          },
          status: 'PUBLISHED',
        },
      })

      // Get total engagement
      const engagementData = await ctx.db.post.aggregate({
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
          },
          publishedAt: {
            gte: startDate,
          },
          status: 'PUBLISHED',
        },
        _sum: {
          views: true,
          likes: true,
          comments: true,
          shares: true,
          saves: true,
        },
      })

      // Get platform breakdown
      const platformBreakdown = await ctx.db.post.groupBy({
        by: ['platform'],
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
          },
          publishedAt: {
            gte: startDate,
          },
          status: 'PUBLISHED',
        },
        _count: {
          id: true,
        },
        _sum: {
          views: true,
          likes: true,
          comments: true,
        },
      })

      // Get top performing posts
      const topPosts = await ctx.db.post.findMany({
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
          },
          publishedAt: {
            gte: startDate,
          },
          status: 'PUBLISHED',
        },
        include: {
          content: {
            select: {
              id: true,
              title: true,
              caption: true,
            },
          },
          account: {
            select: {
              platform: true,
              username: true,
            },
          },
        },
        orderBy: [
          { likes: 'desc' },
          { views: 'desc' },
        ],
        take: 5,
      })

      return {
        totalPosts,
        totalViews: engagementData._sum.views || 0,
        totalLikes: engagementData._sum.likes || 0,
        totalComments: engagementData._sum.comments || 0,
        totalShares: engagementData._sum.shares || 0,
        totalSaves: engagementData._sum.saves || 0,
        platformBreakdown: platformBreakdown.map((item) => ({
          platform: item.platform,
          posts: item._count.id,
          views: item._sum.views || 0,
          likes: item._sum.likes || 0,
          comments: item._sum.comments || 0,
        })),
        topPosts: topPosts.map((post) => ({
          id: post.id,
          title: post.content.title,
          platform: post.account.platform,
          username: post.account.username,
          views: post.views,
          likes: post.likes,
          comments: post.comments,
          shares: post.shares,
          engagementRate: post.views > 0 ? ((post.likes + post.comments + post.shares) / post.views) * 100 : 0,
        })),
      }
    }),

  // Get content performance details
  getContentPerformance: protectedProcedure
    .input(z.object({ contentId: z.string() }))
    .query(async ({ ctx, input }) => {
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
        include: {
          posts: {
            include: {
              account: {
                select: {
                  platform: true,
                  username: true,
                  displayName: true,
                },
              },
            },
          },
        },
      })

      if (!content) {
        throw new Error('Content not found or access denied')
      }

      const totalEngagement = content.posts.reduce(
        (acc, post) => ({
          views: acc.views + post.views,
          likes: acc.likes + post.likes,
          comments: acc.comments + post.comments,
          shares: acc.shares + post.shares,
          saves: acc.saves + post.saves,
        }),
        { views: 0, likes: 0, comments: 0, shares: 0, saves: 0 }
      )

      return {
        content: {
          id: content.id,
          title: content.title,
          caption: content.caption,
          hashtags: content.hashtags,
          createdAt: content.createdAt,
          publishedAt: content.publishedAt,
        },
        posts: content.posts.map((post) => ({
          id: post.id,
          platform: post.account.platform,
          username: post.account.username,
          displayName: post.account.displayName,
          url: post.url,
          publishedAt: post.publishedAt,
          views: post.views,
          likes: post.likes,
          comments: post.comments,
          shares: post.shares,
          saves: post.saves,
          engagementRate: post.views > 0 ? ((post.likes + post.comments + post.shares) / post.views) * 100 : 0,
        })),
        totalEngagement,
        averageEngagementRate: totalEngagement.views > 0 
          ? ((totalEngagement.likes + totalEngagement.comments + totalEngagement.shares) / totalEngagement.views) * 100 
          : 0,
      }
    }),

  // Get engagement trends
  getEngagementTrends: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        timeRange: z.enum(['7d', '30d', '90d']).default('30d'),
        platform: z.nativeEnum(Platform).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const days = input.timeRange === '7d' ? 7 : input.timeRange === '30d' ? 30 : 90
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

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
        publishedAt: {
          gte: startDate,
        },
        status: 'PUBLISHED',
      }

      if (input.platform) {
        whereClause.platform = input.platform
      }

      // Get daily engagement data
      const posts = await ctx.db.post.findMany({
        where: whereClause,
        select: {
          publishedAt: true,
          views: true,
          likes: true,
          comments: true,
          shares: true,
        },
        orderBy: {
          publishedAt: 'asc',
        },
      })

      // Group by date
      const dailyData = posts.reduce((acc, post) => {
        if (!post.publishedAt) return acc

        const dateKey = post.publishedAt.toISOString().split('T')[0]
        if (!acc[dateKey]) {
          acc[dateKey] = {
            date: dateKey,
            views: 0,
            likes: 0,
            comments: 0,
            shares: 0,
            posts: 0,
          }
        }

        acc[dateKey].views += post.views
        acc[dateKey].likes += post.likes
        acc[dateKey].comments += post.comments
        acc[dateKey].shares += post.shares
        acc[dateKey].posts += 1

        return acc
      }, {} as Record<string, any>)

      return Object.values(dailyData).sort((a: any, b: any) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    }),

  // Get hashtag performance
  getHashtagPerformance: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        timeRange: z.enum(['7d', '30d', '90d']).default('30d'),
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const days = input.timeRange === '7d' ? 7 : input.timeRange === '30d' ? 30 : 90
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const contents = await ctx.db.content.findMany({
        where: {
          workspace: {
            id: input.workspaceId,
            members: {
              some: {
                userId: ctx.session.user.id,
              },
            },
          },
          publishedAt: {
            gte: startDate,
          },
          hashtags: {
            not: {
              equals: [],
            },
          },
        },
        include: {
          posts: {
            select: {
              views: true,
              likes: true,
              comments: true,
              shares: true,
            },
          },
        },
      })

      // Analyze hashtag performance
      const hashtagStats = contents.reduce((acc, content) => {
        const totalEngagement = content.posts.reduce(
          (sum, post) => sum + post.likes + post.comments + post.shares,
          0
        )
        const totalViews = content.posts.reduce((sum, post) => sum + post.views, 0)

        content.hashtags.forEach((hashtag) => {
          if (!acc[hashtag]) {
            acc[hashtag] = {
              hashtag,
              uses: 0,
              totalViews: 0,
              totalEngagement: 0,
              avgEngagement: 0,
            }
          }

          acc[hashtag].uses += 1
          acc[hashtag].totalViews += totalViews
          acc[hashtag].totalEngagement += totalEngagement
        })

        return acc
      }, {} as Record<string, any>)

      // Calculate averages and sort
      const hashtagPerformance = Object.values(hashtagStats)
        .map((stat: any) => ({
          ...stat,
          avgEngagement: stat.uses > 0 ? stat.totalEngagement / stat.uses : 0,
          avgViews: stat.uses > 0 ? stat.totalViews / stat.uses : 0,
        }))
        .sort((a: any, b: any) => b.avgEngagement - a.avgEngagement)
        .slice(0, input.limit)

      return hashtagPerformance
    }),
})