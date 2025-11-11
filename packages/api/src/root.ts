import { createTRPCRouter } from './trpc'
import { authRouter } from './routers/auth'
import { contentRouter } from './routers/content'
import { workspaceRouter } from './routers/workspace'
import { schedulerRouter } from './routers/scheduler'
import { analyticsRouter } from './routers/analytics'
import { creditRouter } from './routers/credit'
import { boostRouter } from './routers/boost'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  content: contentRouter,
  workspace: workspaceRouter,
  scheduler: schedulerRouter,
  analytics: analyticsRouter,
  credit: creditRouter,
  boost: boostRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter