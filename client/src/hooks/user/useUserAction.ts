import { TableParams } from '@/components/DataTable';
import { Budget_Data, BUDGET_OVERVIEW } from '@/constants/queryKey';
import { createBudget, deleteBudget, getBudgetDataByParams } from '@/services/budget';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export type budgetDataMutationType = {
  params: TableParams;
  searchData: string;
};

export const useUserAction = () => {
  const queryClient = useQueryClient();

  const budgetDataMutation = useMutation({
    mutationFn: ({ params, searchData }: budgetDataMutationType) =>
      getBudgetDataByParams({ params, searchData }),
    onSuccess: (newData) => {
      queryClient.setQueryData([Budget_Data], () => newData);
    },
  });

  const addBudgetMutation = useMutation({
    mutationFn: createBudget,
    onSuccess: () => {
      // refetch data
      queryClient.invalidateQueries({
        queryKey: [BUDGET_OVERVIEW],
      });
      // queryClient.invalidateQueries({
      //   queryKey: [Budget_Data],
      // });
    },
  });

  const deleteBudgetMutation = useMutation({
    mutationFn: deleteBudget,
    onSuccess: () => {
      // refetch data
      queryClient.invalidateQueries({
        queryKey: [BUDGET_OVERVIEW],
      });
      // queryClient.invalidateQueries({
      //   queryKey: [Budget_Data],
      // });
    },
  });

  return {
    budgetDataMutation,
    addBudgetMutation,
    deleteBudgetMutation,
  };
};
