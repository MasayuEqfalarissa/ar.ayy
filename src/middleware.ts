import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const isApiAuth = request.nextUrl.pathname.startsWith('/api/auth');
  
  // Allow public assets and API auth routes
  if (isApiAuth || request.nextUrl.pathname.startsWith('/_next') || request.nextUrl.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get('ar_ayy_auth');
  const isAuthenticated = authCookie?.value === 'true';

  if (!isAuthenticated && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
