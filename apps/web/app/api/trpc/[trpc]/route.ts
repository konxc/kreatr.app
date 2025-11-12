import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@kreatr/api'
import { createContext } from '@kreatr/api/src/context'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
  })

export { handler as GET, handler as POST }
