import { TableParams } from '@/components/DataTable';
import client from './axiosClient';
import { getHttpOnlyUserData } from './userServer';

export type BudgetDataByParams = {
  pagination: {
    current: number;
    pageSize: number;
    showSizeChanger: boolean;
  };
  sortField: string | null;
  sortOrder: string | null | undefined;
  filters: {
    type: Array<string> | null;
    reoccur: Array<boolean> | null;
  };
};

export const getUserData = async () => {
  const token = await getHttpOnlyUserData();
  const response = await client().get(`/auth-system/user-data`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getBudgetData = async () => {
  const response = await client().get(`/user/budget-list`);
  return response.data;
};

export const getBudgetDataByParams = async (userId: any, params: TableParams) => {
  const { pagination, sortField, sortOrder, filters } = params;

  // Extracting filters
  const type = filters?.type?.length ? filters?.type[0] : null;
  const reoccur = filters?.reoccur?.length ? filters?.reoccur[0] : null;

  const response = await client().get(`/user/budget-list/:${userId}`, {
    params: {
      current: pagination?.current,
      pageSize: pagination?.pageSize,
      sortField,
      sortOrder,
      type,
      reoccur,
    },
  });
  return response.data;
};
