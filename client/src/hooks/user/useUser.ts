import { getBudgetData, getUserData } from '@/services/user';
import { useQuery } from '@tanstack/react-query';

export const useUserData = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getUserData,
  });
};

export const useBudgetData = () => {
  return useQuery({
    queryKey: ['budgetData'],
    queryFn: () => getBudgetData(),
  });
};
