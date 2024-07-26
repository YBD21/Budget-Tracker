import { BudgetDataByParams, getBudgetDataByParams } from '@/services/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type budgetDataMutationType = {
  userId: any;
  params: BudgetDataByParams;
};

export const useUserAction = () => {
  const queryClient = useQueryClient();

  const budgetDataMutation = useMutation({
    mutationFn: ({ userId, params }: budgetDataMutationType) =>
      getBudgetDataByParams(userId, params),
    onSuccess: (newData) => {
      queryClient.setQueryData(['budgetData'], (oldData: any) => {
        if (!oldData) {
          return newData;
        }

        const mergedData = [...newData, ...oldData];
        const uniqueData = mergedData.filter(
          (item, index, self) => index === self.findIndex((t) => t.id === item.id)
        );
        return uniqueData;
      });
    },
  });

  return {
    budgetDataMutation,
  };
};
