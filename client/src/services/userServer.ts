'use server';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { FIND_ACCESS, USER_DATA } from '@/constants/cookiesName';

export const decodeUser = async (accessToken: string) => {
  return jwtDecode(accessToken);
};

export const setHttpOnlyUserData = (token: any): boolean => {
  try {
    const time = 1 * 60 * 60 * 1000; // 60 min

    cookies().set({
      name: USER_DATA,
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: time,
      secure: true,
      // expires: new Date(Date.now() + time),
      sameSite: 'strict',
    });

    return true;
  } catch (error: any) {
    console.log('Error while setting up HTTP Only Cookie !', error.message);
    return false;
  }
};

export const setHttpOnlyFindAccess = (token: any): boolean => {
  try {
    const time = 10 * 60 * 1000; // 10 min
    cookies().set({
      name: FIND_ACCESS,
      value: token,
      httpOnly: true,
      path: '/',
      expires: new Date(Date.now() + time),
    });

    return true;
  } catch (error: any) {
    // console.log(error.message);
    return false;
  }
};

export const getHttpOnlyUserData = (): Promise<string | null> => {
  return new Promise((resolve) => {
    const token = cookies().get(USER_DATA) || null;
    resolve(token?.value || null);
  });
};

export const deleteAllCookies = (): Promise<void> => {
  const cookieStore = cookies();
  return new Promise((resolve) => {
    const allCookies = cookieStore.getAll(); // Get all cookies
    allCookies.forEach((cookie) => {
      cookieStore.delete(cookie.name);
    });
    resolve();
  });
};
