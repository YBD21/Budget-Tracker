import client from './axiosClient';
import { getHttpOnlyUserData } from './userServer';
import { budgetDataMutationType } from '@/hooks/user/useUserAction';

export const getBudgetOverview = async () => {
  const token = await getHttpOnlyUserData();
  const response = await client().get(`/user/budget-overview`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
};

export const getBudgetDataByParams = async ({ params, searchData }: budgetDataMutationType) => {
  const { pagination, sortField, sortOrder, filters } = params;

  // Extracting filters
  const type = filters?.type?.length ? filters?.type[0] : null;
  const reoccur = filters?.reoccur?.length ? filters?.reoccur[0] : null;

  const response = await client().get(`/user/budget-list/`, {
    params: {
      current: pagination?.current,
      pageSize: pagination?.pageSize,
      sortField,
      sortOrder,
      type,
      reoccur,
      searchData,
    },
  });
  return response.data;
};
