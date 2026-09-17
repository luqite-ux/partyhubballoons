import { NextResponse, type NextRequest } from 'next/server'
import { isServiceGuardExcludedPath, isWebsiteServiceAvailable } from './lib/service-status'

export async function middleware(request: NextRequest) {
  if (!isServiceGuardExcludedPath(request.nextUrl.pathname) && !await isWebsiteServiceAvailable()) {
    return NextResponse.rewrite(new URL('/service-expired', request.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/((?!_next/static|_next/image).*)'] }
