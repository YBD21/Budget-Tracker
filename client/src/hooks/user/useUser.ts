import { getUserData } from '@/services/user';
import { useQuery } from '@tanstack/react-query';

export const useUserData = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getUserData,
  });
};
