import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Define protected and guest routes
  const protectedRoutes = ['/dashboard', '/exam', '/questions', '/profile'];
  const guestRoutes = ['/login', '/register', '/'];

  // Check if the current path matches any protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the current path matches any guest route
  // Note: We need to be careful with '/' matching everything if we used startsWith, 
  // but here we want exact match for '/' or startsWith for others if needed.
  // For now, let's stick to the list.
  const isGuestRoute = guestRoutes.includes(pathname) || pathname === '/';

  // 1. Redirect unauthenticated users accessing protected routes to /login
  if (isProtectedRoute && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 2. Redirect authenticated users accessing guest routes to /dashboard
  if (isGuestRoute && token) {
    // Allow access to landing page even if logged in? 
    // The requirement says: "If a logged-in user attempts to access these pages [Landing, Login, Signup], auto-redirect them to /dashboard."
    // So yes, redirect landing page too.
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icons (pwa icons)
     * - manifest.json (pwa manifest)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|icons|manifest.json).*)',
  ],
};
