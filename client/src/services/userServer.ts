'use server';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { FIND_ACCESS, USER_DATA } from '@/constants/queryKey';

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
      expires: new Date(Date.now() + time),
    });

    return true;
  } catch (error: any) {
    console.log(error.message);
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
      maxAge: time,
      expires: new Date(Date.now() + time),
    });

    return true;
  } catch (error: any) {
    console.log(error.message);
    return false;
  }
};
