import { router } from './trpc'
import { authRouter } from './routers/auth'
import { contentRouter } from './routers/content'
import { workspaceRouter } from './routers/workspace'
import { schedulerRouter } from './routers/scheduler'
import { analyticsRouter } from './routers/analytics'
import { creditRouter } from './routers/credit'
import { boostRouter } from './routers/boost'
import { aiRouter } from './routers/ai'
import { paymentRouter } from './routers/payment'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = router({
  auth: authRouter,
  content: contentRouter,
  workspace: workspaceRouter,
  scheduler: schedulerRouter,
  analytics: analyticsRouter,
  credit: creditRouter,
  boost: boostRouter,
  ai: aiRouter,
  payment: paymentRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

// Export createCaller for testing
export { createCaller } from './trpc'