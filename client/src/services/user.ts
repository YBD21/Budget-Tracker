import client from './axiosClient';

export const getUserData = async () => {
  const response = await client().get(`/auth-system/user-data`);
  return response.data;
};
