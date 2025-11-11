import { router, publicProcedure, protectedProcedure } from '../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { hash } from 'bcryptjs'

export const authRouter = router({
  // Get current session
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session
  }),

  // Register new user
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().min(2),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user already exists
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      })

      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User with this email already exists',
        })
      }

      // Hash password
      const hashedPassword = await hash(input.password, 10)

      // Create user
      const user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          name: input.name,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      })

      // Create default workspace for user
      await ctx.prisma.workspace.create({
        data: {
          name: `${input.name}'s Workspace`,
          slug: `${input.name.toLowerCase().replace(/\s+/g, '-')}-${user.id.slice(0, 8)}`,
          members: {
            create: {
              userId: user.id,
              role: 'OWNER',
            },
          },
        },
      })

      return {
        success: true,
        user,
      }
    }),

  // Get user profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        plan: true,
        creditBalance: true,
        onboardingCompleted: true,
        createdAt: true,
      },
    })

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      })
    }

    return user
  }),

  // Update profile
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).optional(),
        image: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: input,
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
        },
      })

      return user
    }),

  // Complete onboarding
  completeOnboarding: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: { onboardingCompleted: true },
    })

    return { success: true }
  }),
})
