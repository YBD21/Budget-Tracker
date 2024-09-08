import { useCallback, useEffect, useState } from 'react';
import { Table } from 'antd';
import type { GetProp, TablePaginationConfig, TableProps } from 'antd';
import { SorterResult } from 'antd/es/table/interface';
import { useSearchStore, useThemeStore } from '@/context/Store';
import StyleWrapper from './StyleWrapper';

import { useBudgetData, useBudgetOverview } from '@/hooks/user/useUser';
import { DataType, useColumns } from './Columns';

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

  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 5,
      showSizeChanger: false,
    },
  });

  const [totalRecords, setTotalRecords] = useState<number>(currentUser?.totalEntry || 1);

  const { pagination, sortField, sortOrder, filters } = tableParams;

  // Use the useBudgetData hook to fetch the data, passing updated params and searchData
  const { data: budgetData, isLoading } = useBudgetData({
    params: { pagination, sortField, sortOrder, filters },
    searchData,
  });

  useEffect(() => {
    if (budgetData) {
      setDataSource(budgetData.data); // Set the data source from the query result
      setTotalRecords(budgetData.total || 0); // Update total records
    }
  }, [budgetData, tableParams, searchData]); // Re-run this effect if tableParams or searchData change

  useEffect(() => {
    if (currentUser) {
      setTotalRecords(currentUser.totalEntry || 1);
    }
  }, [currentUser]);

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
        loading={isLoading} // Use isLoading to show the loading state
      />
    </StyleWrapper>
  );
};

export default DataTable;
