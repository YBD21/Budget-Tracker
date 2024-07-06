import client from './axiosClient';
import { getHttpOnlyUserData } from './userServer';

export const getUserData = async () => {
  const token = await getHttpOnlyUserData();
  const response = await client().get(`/auth-system/user-data`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
