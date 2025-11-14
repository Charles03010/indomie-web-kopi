import { NextRequest, NextResponse } from 'next/server';

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const sessionCookie = req.cookies.get('session')?.value;

  const protectedPaths = ['/dashboard','/settings'];
  const isProtected = protectedPaths.some((path) =>
    url.pathname === path || url.pathname.startsWith(`${path}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  if (!sessionCookie) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*'], 
};
