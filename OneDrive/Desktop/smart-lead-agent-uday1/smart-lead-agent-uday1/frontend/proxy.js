import { NextResponse } from 'next/server'

export function proxy(request) {
  const token = request.cookies.get('auth_token')?.value
  const { pathname } = request.nextUrl

  // Protected routes: everything except /signin, /signup, and static files
  const isAuthPage = pathname.startsWith('/signin') || pathname.startsWith('/signup')
  const isPublicFile = pathname.startsWith('/_next') || pathname.includes('.') || pathname.startsWith('/api')

  if (isPublicFile) {
    return NextResponse.next()
  }

  if (!token && !isAuthPage) {
    // Redirect to signin if accessing protected page without token
    const url = new URL('/signin', request.url)
    return NextResponse.redirect(url)
  }

  if (token && isAuthPage) {
    // Redirect to dashboard if accessing auth pages with token
    const url = new URL('/', request.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
