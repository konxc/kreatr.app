import { type Session } from 'next-auth'
import { prisma } from '@kreatr/database'

export interface CreateContextOptions {
  session: Session | null
}

export const createContext = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
