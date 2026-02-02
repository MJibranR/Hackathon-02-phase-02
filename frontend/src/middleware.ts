import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow all paths through — auth is handled client-side via AuthContext.
  // Middleware can't access React state (token is in memory, not a cookie),
  // so route protection happens in DashboardPage and other components directly.
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};