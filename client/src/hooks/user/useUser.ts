import { CURRENT_USER } from '@/constants/queryKey';
import { getUserData } from '@/services/user';
import { useQuery } from '@tanstack/react-query';

export const useUserData = () => {
  return useQuery({
    queryKey: [CURRENT_USER],
    queryFn: getUserData,
  });
};

// export const useBudgetData = () => {
//   return useQuery({
//     queryKey: ['budgetData'],
//     queryFn: () => getBudgetDataByParams,
//   });
// };
