import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { getHttpOnlyUserData } from './userServer';

const ROOT_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;

const axiosClient = () => {
  const instance = axios.create({
    baseURL: ROOT_URL,
    withCredentials: true,
  });

  instance.interceptors.request.use(
    async (config) => {
      try {
        const token = await getHttpOnlyUserData();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  return instance;
};

export default axiosClient;
