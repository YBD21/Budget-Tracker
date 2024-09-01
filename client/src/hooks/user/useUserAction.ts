import { TableParams } from '@/components/DataTable';
import { createBudget, getBudgetDataByParams } from '@/services/budget';
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
      queryClient.setQueryData(['budgetData'], (oldData: any) => {
        if (!oldData) {
          return newData;
        }

        // const mergedData = [...newData, ...oldData];
        // const uniqueData = mergedData.filter(
        //   (item, index, self) => index === self.findIndex((t) => t.id === item.id)
        // );
        // return uniqueData;

        return newData;
      });
    },
  });

  const addBudgetMutation = useMutation({
    mutationFn: createBudget,
  });

  return {
    budgetDataMutation,
    addBudgetMutation,
  };
};
