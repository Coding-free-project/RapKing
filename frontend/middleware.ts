import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

const intlMiddleware = createMiddleware({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'always',
})

export default function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // Skip admin routes from i18n
  if (pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
