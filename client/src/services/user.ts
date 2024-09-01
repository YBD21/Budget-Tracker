import client from './axiosClient';
import { getHttpOnlyUserData } from './userServer';

// export type BudgetDataByParams = {
//   pagination: {
//     current: number;
//     pageSize: number;
//     showSizeChanger: boolean;
//   };
//   sortField: string | null;
//   sortOrder: string | null | undefined;
//   filters: {
//     type: Array<string> | null;
//     reoccur: Array<boolean> | null;
//   };
// };

export const getUserName = async () => {
  const token = await getHttpOnlyUserData();
  const response = await client().get(`/user/user-name`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
};
