import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyEmployerSession } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect employer routes
  if (pathname.startsWith('/employers') && pathname !== '/employers/login' && pathname !== '/employers/register' && !pathname.includes('.')) {
    const sessionToken = request.cookies.get("WHR_EMPLOYER_SESSION")?.value
    
    if (!sessionToken) {
      // Not logged in: Redirect to login
      // return NextResponse.redirect(new URL('/login', request.url)) // Or as per V1 logic
    } else {
      const session = await verifyEmployerSession(sessionToken)
      if (!session) {
        // Invalid session: redirect
        // return NextResponse.redirect(new URL('/login', request.url))
      }
      
      // Note: Full status check requires database lookup, 
      // which is usually too slow for edge middleware without global caches.
      // However, we can enforce the block at the API and Page level.
    }
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
