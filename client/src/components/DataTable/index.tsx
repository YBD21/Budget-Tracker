import { useCallback, useEffect, useState } from 'react';
import { Table } from 'antd';
import type { GetProp, TablePaginationConfig, TableProps } from 'antd';
import { SorterResult } from 'antd/es/table/interface';
import { useSearchStore, useThemeStore } from '@/context/Store';
import StyleWrapper from './StyleWrapper';

import { useUserAction } from '@/hooks/user/useUserAction';
import { DataType, useColumns } from './Columns';
import { useBudgetOverview } from '@/hooks/user/useUser';

export interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>['field'];
  sortOrder?: SorterResult<any>['order'];
  filters?: Parameters<GetProp<TableProps<DataType>, 'onChange'>>[1];
}

const DataTable: React.FC = () => {
  const { data: currentUser } = useBudgetOverview();
  const { theme: themeValue } = useThemeStore();

  const { searchData } = useSearchStore();
  const { budgetDataMutation } = useUserAction();

  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 5,
      showSizeChanger: false,
    },
  });

  const [totalRecords, setTotalRecords] = useState<number>(currentUser?.totalEntry || 1);

  const fetchData = useCallback(async () => {
    try {
      const { pagination, sortField, sortOrder, filters } = tableParams;
      const budgetData = await budgetDataMutation.mutateAsync({
        params: { pagination, sortField, sortOrder, filters },
        searchData,
      });

      setDataSource(budgetData?.data);

      setTotalRecords(budgetData?.total || 0);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [budgetDataMutation, totalRecords, tableParams, searchData]);

  useEffect(() => {
    if (currentUser) {
      setTotalRecords(currentUser.totalEntry || 1);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchData();
  }, [tableParams, searchData]);

  const handleTableChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    });
  };

  return (
    <StyleWrapper className={`${themeValue === 'light' ? 'light' : 'dark'} rounded-lg`}>
      <Table
        columns={useColumns()}
        dataSource={dataSource}
        onChange={handleTableChange}
        pagination={{
          current: tableParams.pagination?.current,
          pageSize: tableParams.pagination?.pageSize,
          total: totalRecords,
          showSizeChanger: false,
        }}
        loading={budgetDataMutation?.isPending}
      />
    </StyleWrapper>
  );
};

export default DataTable;
