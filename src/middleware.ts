import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;
  
  // Skip static files and API routes
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // For development: use slug from query param or subdomain
  // For production: resolve from domain
  const slug = hostname.split('.')[0]; // subdomain-based: takosushi.autorestro.cl
  
  // Store slug in header for server components
  const response = NextResponse.next();
  response.headers.set('x-restaurant-slug', slug);
  return response;
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
};
