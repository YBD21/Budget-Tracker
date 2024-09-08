import { TableParams } from '@/components/DataTable';
import { Budget_Data, BUDGET_OVERVIEW, CURRENT_USER } from '@/constants/queryKey';
import { getBudgetDataByParams, getBudgetOverview } from '@/services/budget';
import { getUserName } from '@/services/user';
import { useQuery } from '@tanstack/react-query';

export type budgetDataMutationType = {
  params: TableParams;
  searchData: string;
};

export const useBudgetOverview = () => {
  return useQuery({
    queryKey: [BUDGET_OVERVIEW],
    queryFn: getBudgetOverview,
  });
};

export const useBudgetData = ({ params, searchData }: budgetDataMutationType) => {
  return useQuery({
    queryKey: [Budget_Data, params, searchData],
    queryFn: () => getBudgetDataByParams({ params, searchData }),
  });
};

export const useUserName = () => {
  return useQuery({
    queryKey: [CURRENT_USER],
    queryFn: getUserName,
  });
};
