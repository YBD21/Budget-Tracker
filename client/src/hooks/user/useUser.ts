import { BUDGET_OVERVIEW, CURRENT_USER } from '@/constants/queryKey';
import { getBudgetOverview, getUserName } from '@/services/user';
import { useQuery } from '@tanstack/react-query';

export const useBudgetOverview = () => {
  return useQuery({
    queryKey: [BUDGET_OVERVIEW],
    queryFn: getBudgetOverview,
  });
};

export const useUserName = () => {
  return useQuery({
    queryKey: [CURRENT_USER],
    queryFn: getUserName,
  });
};
