import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { CreditType } from '@kreatr/database'

export const creditRouter = createTRPCRouter({
  // Get user's current credit balance
  getBalance: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { creditBalance: true },
    })

    return user?.creditBalance || 0
  }),

  // Get credit transaction history
  getTransactions: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        type: z.nativeEnum(CreditType).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const whereClause: any = {
        userId: ctx.session.user.id,
      }

      if (input.type) {
        whereClause.type = input.type
      }

      const transactions = await ctx.db.creditTransaction.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        take: input.limit,
        skip: input.offset,
      })

      const total = await ctx.db.creditTransaction.count({
        where: whereClause,
      })

      return {
        transactions,
        total,
        hasMore: input.offset + input.limit < total,
      }
    }),

  // Use credits for AI generation
  useCredits: protectedProcedure
    .input(
      z.object({
        amount: z.number().min(1),
        description: z.string(),
        metadata: z.record(z.any()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { creditBalance: true },
      })

      if (!user || user.creditBalance < input.amount) {
        throw new Error('Insufficient credits')
      }

      const newBalance = user.creditBalance - input.amount

      // Create transaction record
      const transaction = await ctx.db.creditTransaction.create({
        data: {
          userId: ctx.session.user.id,
          amount: -input.amount,
          type: CreditType.USAGE,
          description: input.description,
          balance: newBalance,
          metadata: input.metadata,
        },
      })

      // Update user balance
      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { creditBalance: newBalance },
      })

      return {
        transaction,
        newBalance,
      }
    }),

  // Add credits (for purchases or rewards)
  addCredits: protectedProcedure
    .input(
      z.object({
        amount: z.number().min(1),
        type: z.nativeEnum(CreditType),
        description: z.string(),
        metadata: z.record(z.any()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { creditBalance: true },
      })

      if (!user) {
        throw new Error('User not found')
      }

      const newBalance = user.creditBalance + input.amount

      // Create transaction record
      const transaction = await ctx.db.creditTransaction.create({
        data: {
          userId: ctx.session.user.id,
          amount: input.amount,
          type: input.type,
          description: input.description,
          balance: newBalance,
          metadata: input.metadata,
        },
      })

      // Update user balance
      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { creditBalance: newBalance },
      })

      return {
        transaction,
        newBalance,
      }
    }),

  // Get credit pricing tiers
  getPricingTiers: protectedProcedure.query(async () => {
    // This could be stored in database or config
    return [
      {
        id: 'starter',
        name: 'Starter Pack',
        credits: 100,
        price: 50000, // IDR 50,000
        bonus: 0,
        popular: false,
      },
      {
        id: 'popular',
        name: 'Popular Pack',
        credits: 250,
        price: 100000, // IDR 100,000
        bonus: 25, // 25 bonus credits
        popular: true,
      },
      {
        id: 'pro',
        name: 'Pro Pack',
        credits: 500,
        price: 180000, // IDR 180,000
        bonus: 75, // 75 bonus credits
        popular: false,
      },
      {
        id: 'enterprise',
        name: 'Enterprise Pack',
        credits: 1000,
        price: 300000, // IDR 300,000
        bonus: 200, // 200 bonus credits
        popular: false,
      },
    ]
  }),

  // Get credit usage statistics
  getUsageStats: protectedProcedure
    .input(
      z.object({
        timeRange: z.enum(['7d', '30d', '90d']).default('30d'),
      })
    )
    .query(async ({ ctx, input }) => {
      const days = input.timeRange === '7d' ? 7 : input.timeRange === '30d' ? 30 : 90
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      // Get usage transactions
      const usageTransactions = await ctx.db.creditTransaction.findMany({
        where: {
          userId: ctx.session.user.id,
          type: CreditType.USAGE,
          createdAt: {
            gte: startDate,
          },
        },
        orderBy: { createdAt: 'desc' },
      })

      const totalUsed = usageTransactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0)

      // Group by feature/description
      const usageByFeature = usageTransactions.reduce((acc, tx) => {
        const feature = tx.description
        if (!acc[feature]) {
          acc[feature] = {
            feature,
            credits: 0,
            uses: 0,
          }
        }
        acc[feature].credits += Math.abs(tx.amount)
        acc[feature].uses += 1
        return acc
      }, {} as Record<string, any>)

      // Daily usage trend
      const dailyUsage = usageTransactions.reduce((acc, tx) => {
        const dateKey = tx.createdAt.toISOString().split('T')[0]
        if (!acc[dateKey]) {
          acc[dateKey] = {
            date: dateKey,
            credits: 0,
            transactions: 0,
          }
        }
        acc[dateKey].credits += Math.abs(tx.amount)
        acc[dateKey].transactions += 1
        return acc
      }, {} as Record<string, any>)

      return {
        totalUsed,
        usageByFeature: Object.values(usageByFeature).sort((a: any, b: any) => b.credits - a.credits),
        dailyUsage: Object.values(dailyUsage).sort((a: any, b: any) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
      }
    }),

  // Check if user has enough credits for an operation
  checkCredits: protectedProcedure
    .input(z.object({ amount: z.number().min(1) }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { creditBalance: true },
      })

      return {
        hasEnough: (user?.creditBalance || 0) >= input.amount,
        currentBalance: user?.creditBalance || 0,
        needed: input.amount,
      }
    }),
})