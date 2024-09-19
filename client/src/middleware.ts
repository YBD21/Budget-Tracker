import { NextRequest, NextResponse } from 'next/server';
// import { cookies } from 'next/headers';

import { DASHBOARD, LOGIN, ACCESS_ONCE_ROUTES, PROTECTED_CLIENT_ROUTES } from './constants/Routes';
import { CLIENT } from './constants/actionName';
// import { USER_DATA } from './constants/cookiesName';
// import { decodeUser } from './services/userServer';
// import { JwtPayload } from 'jwt-decode';
import { useUserStore } from './context/Store';

// interface DecodedToken extends JwtPayload {
//   role: string;
// }

export default async function middleware(req: NextRequest) {
  const getRole = useUserStore.getState().userData?.role;

  const role = getRole ?? '';

  console.log(role);
  // const token = cookies().get(USER_DATA);

  // if (token) {
  //   try {
  //     const decodedToken = await decodeUser(token.value);
  //     role = (decodedToken as DecodedToken)?.role?.toLowerCase() || '';
  //   } catch (error: any) {
  //     console.log('Token decoding error:', error);
  //   }
  // }

  const { pathname, origin } = req.nextUrl;

  let redirectPath;

  switch (role) {
    case CLIENT:
      if (ACCESS_ONCE_ROUTES.includes(pathname)) {
        redirectPath = DASHBOARD;
      }
      break;
    default:
      if (PROTECTED_CLIENT_ROUTES.includes(pathname)) {
        redirectPath = LOGIN;
      } else if (!ACCESS_ONCE_ROUTES.includes(pathname)) {
        redirectPath = LOGIN;
      }
      break;
  }

  if (redirectPath) {
    try {
      const absoluteURL = new URL(redirectPath, origin);
      return NextResponse.redirect(absoluteURL);
    } catch (error) {
      console.log('redirectPath error:', error);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
