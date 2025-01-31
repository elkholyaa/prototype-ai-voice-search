import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Prevent infinite redirect loops
    if (pathname === '/ar' || pathname === '/en') {
        return NextResponse.next();
    }

    // Default language redirection
    if (pathname === '/') {
        return NextResponse.redirect(new URL('/ar', req.url));
    }

    return NextResponse.next();
}
