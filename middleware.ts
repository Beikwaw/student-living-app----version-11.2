import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the token from the cookies
  const token = request.cookies.get('token');

  // Protected routes that require authentication
  if (request.nextUrl.pathname.startsWith('/student') || 
      request.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Public routes - if user is already logged in, redirect to student dashboard
  if (request.nextUrl.pathname === '/login' || 
      request.nextUrl.pathname === '/register') {
    if (token) {
      return NextResponse.redirect(new URL('/student', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/student/:path*', '/admin/:path*', '/login', '/register']
}; 