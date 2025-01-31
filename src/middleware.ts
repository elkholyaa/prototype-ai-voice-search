import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { languages, defaultLanguage, isValidLanguage } from './config/languages'

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const pathname = request.nextUrl.pathname

  // Check if the pathname starts with a locale
  const pathnameHasLocale = languages.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (!pathnameHasLocale) {
    // Redirect to default locale if no locale is present
    return NextResponse.redirect(
      new URL(`/${defaultLanguage}${pathname === '/' ? '' : pathname}`, request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 