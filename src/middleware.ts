// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  try {
    // Refresh session if expired - required for Server Components
    const {
      data: { session },
      error
    } = await supabase.auth.getSession();

    if (error) {
      console.error('Session error in middleware:', error);
    }

    const pathname = req.nextUrl.pathname;
    console.log('Middleware processing:', pathname, 'Session exists:', !!session);

    // Protected routes yang memerlukan authentication
    const protectedRoutes = ['/dashboard', '/profile', '/inventory', '/users', '/reports'];
    
    // Auth routes yang tidak boleh diakses jika sudah login
    const authRoutes = ['/login'];

    // Public routes yang bisa diakses tanpa auth
    const publicRoutes = ['/callback'];

    // Check route types
    const isProtectedRoute = protectedRoutes.some(route => 
      pathname.startsWith(route)
    );
    
    const isAuthRoute = authRoutes.some(route => 
      pathname.startsWith(route)
    );

    const isPublicRoute = publicRoutes.some(route => 
      pathname.startsWith(route)
    );

    // Always allow callback route
    if (pathname === '/callback') {
      console.log('Allowing callback route');
      return res;
    }

    // Handle root route dengan authentication check
    if (pathname === '/') {
      if (session) {
        console.log('Root route: User logged in, redirecting to dashboard');
        return NextResponse.redirect(new URL('/dashboard', req.url));
      } else {
        console.log('Root route: User not logged in, redirecting to login');
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    // Jika mengakses protected route tanpa session
    if (isProtectedRoute && !session) {
      console.log('Protected route without session, redirecting to login');
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Jika mengakses auth route dengan session aktif
    if (isAuthRoute && session) {
      console.log('Auth route with active session, redirecting');
      // Check if there's a redirectTo parameter
      const redirectTo = req.nextUrl.searchParams.get('redirectTo');
      const redirectUrl = redirectTo && redirectTo !== '/' ? redirectTo : '/dashboard';
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }

    // Allow access to other routes
    console.log('Allowing route:', pathname);
    return res;

  } catch (error) {
    console.error('Middleware error:', error);
    // Jika ada error, redirect ke login untuk safety (kecuali untuk callback)
    if (req.nextUrl.pathname !== '/login' && req.nextUrl.pathname !== '/callback') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return res;
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
};