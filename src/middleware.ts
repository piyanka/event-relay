import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { UserRole } from '@/types/domain';

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  });

  const role = token?.role as UserRole | undefined;
  const pathname = request.nextUrl.pathname;

  console.log("Middleware token:", token);
  console.log("Role:", token?.role);

  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      const redirectUrl = new URL('/login', request.nextUrl);
      redirectUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (role !== 'HOST') {
      return NextResponse.redirect(new URL('/my-events', request.nextUrl));
    }
  }

  if (pathname.startsWith('/my-events')) {
    if (!token) {
      const redirectUrl = new URL('/login', request.nextUrl);
      redirectUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (role !== 'ATTENDEE') {
      return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
    }
  }

  if ((pathname === '/login' || pathname === '/signup') && token) {
    if (role === 'HOST') {
      return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
    }

    return NextResponse.redirect(new URL('/my-events', request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/my-events/:path*', '/login', '/signup'],
};
