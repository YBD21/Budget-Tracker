import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import {
  HOME,
  LOGIN,
  ACCESS_ONCE_ROUTES,
  PROTECTED_CLIENT_ROUTES,
} from './constants/Routes'
import { CLIENT } from './constants/actionName'
import { USER_DATA } from './constants/queryKey'
import { decodeUser } from './services/userServer'

export default async function middleware(req) {
  let role = ''
  const token = cookies().get(USER_DATA)

  if (token) {
    try {
      const decodedToken = await decodeUser(token.value)
      role = decodedToken.role.toLowerCase() || ''
    } catch (error) {
      console.error('Token decoding error:', error)
    }
  }

  const { pathname, origin } = req.nextUrl

  let redirectPath

  switch (role) {
    case CLIENT:
      if (ACCESS_ONCE_ROUTES.includes(pathname)) {
        redirectPath = HOME
      }
      break
    default:
      if (PROTECTED_CLIENT_ROUTES.includes(pathname)) {
        redirectPath = LOGIN
      } else if (!ACCESS_ONCE_ROUTES.includes(pathname)) {
        redirectPath = LOGIN
      }
      break
  }

  if (redirectPath) {
    const absoluteURL = new URL(redirectPath, origin)
    return NextResponse.redirect(absoluteURL.toString())
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
