import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/login') || 
                       req.nextUrl.pathname.startsWith('/register')
    const isProtectedPage = req.nextUrl.pathname.startsWith('/dashboard') ||
                           req.nextUrl.pathname.startsWith('/workspace') ||
                           req.nextUrl.pathname.startsWith('/content') ||
                           req.nextUrl.pathname.startsWith('/settings')

    // Redirect authenticated users away from auth pages
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Redirect unauthenticated users to login
    if (isProtectedPage && !isAuth) {
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }

      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      )
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true, // We handle authorization in the middleware function
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/workspace/:path*',
    '/content/:path*',
    '/settings/:path*',
    '/login',
    '/register',
  ],
}
