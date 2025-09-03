import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// This middleware runs on every request
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Create a Supabase client using the new SSR package
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove: (name, options) => {
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Refresh the session if it exists
  const { data: { session } } = await supabase.auth.getSession();

  // Check if the request is for a protected route
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/polls/create') || 
                          req.nextUrl.pathname.startsWith('/dashboard');

  // If it's a protected route and there's no session, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth/login', req.url);
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If it's an auth route and there's a session, redirect to home
  const isAuthRoute = req.nextUrl.pathname.startsWith('/auth/');
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    // Protected routes
    '/polls/create/:path*',
    '/dashboard/:path*',
    // Auth routes
    '/auth/:path*',
  ],
};