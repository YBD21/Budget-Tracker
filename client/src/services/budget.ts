import { AddBudgetInputs } from '@/components/AddBudget';
import client from './axiosClient';
import { getHttpOnlyUserData } from './userServer';
import { budgetDataMutationType } from '@/hooks/user/useUserAction';

const baseUrl = '/user';

export const getBudgetOverview = async () => {
  const token = await getHttpOnlyUserData();
  const response = await client().get(`${baseUrl}/budget-overview`, {
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

  const response = await client().get(`${baseUrl}/budget-list`, {
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

export const createBudget = async (data: AddBudgetInputs) => {
  const respond = await client().post(`${baseUrl}/create-budget`, data);
  return respond.data;
};

export const deleteBudget = async (data: any) => {
  const respond = await client().delete(`${baseUrl}/delete-budget`, data);
  return respond.data;
};
