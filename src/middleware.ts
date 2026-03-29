import { NextRequest, NextResponse } from 'next/server';

const PLATFORM_DOMAINS = ['autorestro.cl', 'localhost', 'vercel.app'];

// In-memory cache for domain resolution
const domainCache = new Map<string, { slug: string; expires: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  const pathname = url.pathname;

  // Skip static files, API routes, and 404
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.includes('.') || 
    pathname === '/404'
  ) {
    return NextResponse.next();
  }

  let slug = '';
  const isPlatformDomain = PLATFORM_DOMAINS.some(domain => 
    hostname.endsWith(domain)
  );

  if (isPlatformDomain) {
    const hostParts = hostname.split('.');
    
    // Check if it's a subdomain (e.g. takosushi.autorestro.cl)
    // For localhost, check if there's at least one dot (e.g. takosushi.localhost)
    const isSubdomain = hostname.includes('localhost') 
      ? hostParts.length >= 2 
      : hostParts.length >= 3;

    if (isSubdomain) {
      slug = hostParts[0];
    } else {
      // Root platform domain, slug must be in path
      const pathParts = pathname.split('/');
      slug = pathParts[1];
      
      if (!slug) return NextResponse.next();
      
      const response = NextResponse.next();
      response.headers.set('x-restaurant-slug', slug);
      return response;
    }
  } else {
    // Custom domain resolution
    const cached = domainCache.get(hostname);
    if (cached && cached.expires > Date.now()) {
      slug = cached.slug;
    } else {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const res = await fetch(`${apiUrl}/storefront/resolve-domain?domain=${hostname}`);
        
        if (res.ok) {
          const data = await res.json();
          slug = data.slug;
          domainCache.set(hostname, { slug, expires: Date.now() + CACHE_TTL });
        } else {
          // If not found, redirect to 404
          return NextResponse.rewrite(new URL('/404', request.url));
        }
      } catch (error) {
        console.error('Error resolving custom domain:', error);
        // Fallback or error page
        return NextResponse.rewrite(new URL('/404', request.url));
      }
    }
  }

  // Rewrite logic to map domains/subdomains to /[slug] routes
  if (slug && !pathname.startsWith(`/${slug}`)) {
    url.pathname = `/${slug}${pathname === '/' ? '' : pathname}`;
    const response = NextResponse.rewrite(url);
    response.headers.set('x-restaurant-slug', slug);
    return response;
  }

  const response = NextResponse.next();
  if (slug) {
    response.headers.set('x-restaurant-slug', slug);
  }
  return response;
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
};
