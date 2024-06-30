import client from './axiosClient';

export const getCsrfToken = async () => {
  const response = await client().get(`/`);
  return response.data;
};
