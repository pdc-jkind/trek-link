// middleware.ts
import { type NextRequest, NextResponse } from 'next/server'
import { AuthServerService } from '@/lib/auth/auth.server'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  try {
    // Cek authentication menggunakan AuthServerService
    const isAuthenticated = await AuthServerService.isMiddlewareAuthenticated(req, res)
    
    // Optional: Refresh session jika diperlukan untuk menjaga session tetap aktif
    if (isAuthenticated) {
      await AuthServerService.refreshMiddlewareSession(req, res)
    }

    const pathname = req.nextUrl.pathname
    console.log('Middleware processing:', pathname, 'Authenticated:', isAuthenticated)

    // Protected routes yang memerlukan authentication
    const protectedRoutes = ['/dashboard', '/profile', '/inventory', '/users', '/reports']
    
    // Auth routes yang tidak boleh diakses jika sudah login
    const authRoutes = ['/login']

    // Auth callback route - allow to pass through for server-side processing
    if (pathname === '/auth/callback' || pathname === '/callback') {
      console.log('Allowing auth callback route for server-side processing')
      return res
    }

    // Check route types
    const isProtectedRoute = protectedRoutes.some(route => 
      pathname.startsWith(route)
    )
    
    const isAuthRoute = authRoutes.some(route => 
      pathname.startsWith(route)
    )

    // Handle root route dengan authentication check
    if (pathname === '/') {
      if (isAuthenticated) {
        console.log('Root route: User authenticated, redirecting to dashboard')
        return NextResponse.redirect(new URL('/dashboard', req.url))
      } else {
        console.log('Root route: User not authenticated, redirecting to login')
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }

    // Jika mengakses protected route tanpa authentication
    if (isProtectedRoute && !isAuthenticated) {
      console.log('Protected route without authentication, redirecting to login')
      const redirectUrl = new URL('/login', req.url)
      redirectUrl.searchParams.set('redirect_to', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Jika mengakses auth route dengan authentication aktif
    if (isAuthRoute && isAuthenticated) {
      console.log('Auth route with active authentication, redirecting')
      // Check if there's a redirect_to parameter
      const redirectTo = req.nextUrl.searchParams.get('redirect_to')
      const redirectUrl = redirectTo && redirectTo !== '/' ? redirectTo : '/dashboard'
      return NextResponse.redirect(new URL(redirectUrl, req.url))
    }

    // Allow access to other routes
    console.log('Allowing route:', pathname)
    return res

  } catch (error) {
    console.error('Middleware error:', error)
    
    // Jika ada error, redirect ke login untuk safety (kecuali untuk callback routes)
    const isCallbackRoute = req.nextUrl.pathname === '/login' || 
                           req.nextUrl.pathname === '/auth/callback' || 
                           req.nextUrl.pathname === '/callback'
    
    if (!isCallbackRoute) {
      console.log('Middleware error occurred, redirecting to login for safety')
      return NextResponse.redirect(new URL('/login', req.url))
    }
    
    return res
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)  
     * - favicon.ico (favicon file)
     * - public folder files
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}