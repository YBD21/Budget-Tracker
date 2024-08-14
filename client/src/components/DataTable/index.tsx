import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Table } from 'antd';
import type { GetProp, TableColumnsType, TablePaginationConfig, TableProps } from 'antd';
import { SorterResult } from 'antd/es/table/interface';
import { useThemeStore, useUserStore } from '@/context/Store';
import StyleWrapper from './StyleWrapper';
import ActionTab from './ActionTab';
import { useUserAction } from '@/hooks/user/useUserAction';

interface DataType {
  key: React.Key;
  date: string;
  title: string;
  type: string;
  reoccur: boolean;
  amount: number;
}

export interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>['field'];
  sortOrder?: SorterResult<any>['order'];
  filters?: Parameters<GetProp<TableProps<DataType>, 'onChange'>>[1];
}

const DataTable: React.FC = () => {
  const { theme } = useThemeStore();
  const { userData } = useUserStore();
  const { budgetDataMutation } = useUserAction();

  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 5,
      showSizeChanger: false,
      total: 1,
    },
  });

  const prevTableParamsRef = useRef<TableParams>(tableParams);
  const fetchTriggeredByDataSourceRef = useRef<boolean>(false);

  // Effect to update pagination based on userData
  useEffect(() => {
    if (userData) {
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: userData.totalEntry ?? 0,
        },
      }));
    }
  }, [userData]);

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      const { pagination, sortField, sortOrder, filters } = tableParams;
      const budgetData = await budgetDataMutation.mutateAsync({
        params: { pagination, sortField, sortOrder, filters },
      });

      setDataSource(budgetData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [budgetDataMutation, tableParams]);

  // Effect to manage fetching data based on tableParams changes
  useEffect(() => {
    if (
      prevTableParamsRef.current.pagination !== tableParams.pagination ||
      prevTableParamsRef.current.sortField !== tableParams.sortField ||
      prevTableParamsRef.current.sortOrder !== tableParams.sortOrder ||
      prevTableParamsRef.current.filters !== tableParams.filters
    ) {
      if (!fetchTriggeredByDataSourceRef.current) {
        fetchData();
      } else {
        fetchTriggeredByDataSourceRef.current = false;
      }
      prevTableParamsRef.current = tableParams;
    }
  }, [tableParams]);

  // Effect to update pagination based on dataSource length
  useEffect(() => {
    if (dataSource.length < 5 && dataSource.length > 0) {
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: prev.pagination?.current ? prev.pagination.current * 5 : 5,
        },
      }));
      fetchTriggeredByDataSourceRef.current = true; // Set ref to prevent fetch
    }
  }, [dataSource]);

  const handleTableChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    });
  };

  const columns: TableColumnsType<DataType> = useMemo(
    () => [
      {
        title: 'Date',
        dataIndex: 'date',
        align: 'center',
        sorter: true,
        sortDirections: ['descend'],
        render: (timestamp: number) => new Date(timestamp * 1000).toLocaleDateString('en-CA'),
      },
      {
        title: 'Title',
        dataIndex: 'title',
        align: 'center',
      },
      {
        title: 'Type',
        dataIndex: 'type',
        align: 'center',
        filters: [
          {
            text: (
              <span className="text-green-600 dark:text-green-500 text-center font-semibold">
                Income{' '}
              </span>
            ),
            value: 'Income',
          },
          {
            text: (
              <span className="text-red-600 dark:text-red-500 text-center font-semibold">
                Expense
              </span>
            ),
            value: 'Expense',
          },
        ],
        onFilter: (value, record) => record.type === value,
        render: (type) =>
          type === 'Income' ? (
            <span className="text-green-600 dark:text-green-500 text-center font-semibold">
              Income{' '}
            </span>
          ) : (
            <span className="text-red-600 dark:text-red-500 text-center font-semibold">
              Expense
            </span>
          ),
        filterMultiple: false,
      },
      {
        title: 'Reoccur',
        dataIndex: 'reoccur',
        align: 'center',
        filters: [
          {
            text: (
              <span className="text-gray-700 dark:text-gray-300 text-center font-semibold">
                Yearly
              </span>
            ),
            value: 'Year',
          },
          {
            text: (
              <span className="text-blue-500 dark:text-blue-400 text-center font-semibold">
                Monthly
              </span>
            ),
            value: 'Month',
          },
          {
            text: (
              <span className="text-stone-600 dark:text-stone-400 text-center font-semibold">
                Once
              </span>
            ),
            value: 'Once',
          },
        ],
        onFilter: (value, record) => record.reoccur === value,
        render: (reoccur) =>
          reoccur === 'Year' ? (
            <span className="text-gray-700 dark:text-gray-300 text-center font-semibold">
              Yearly
            </span>
          ) : reoccur === 'Month' ? (
            <span className="text-blue-500 dark:text-blue-400 text-center font-semibold">
              Monthly
            </span>
          ) : (
            <span className="text-stone-600 dark:text-stone-400 text-center font-semibold">
              Once
            </span>
          ),
        filterMultiple: false,
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        align: 'center',
        sorter: true,
        sortDirections: ['descend', 'ascend'],
        render: (amount) =>
          `Rs. ${new Intl.NumberFormat('en-IN', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)}`,
      },
      {
        title: 'Action',
        dataIndex: 'action',
        align: 'center',
        render: (_, record) => <ActionTab record={record} />,
      },
    ],
    []
  );

  return (
    <StyleWrapper className={`${theme === 'dark' ? 'dark' : 'light'} rounded-lg`}>
      <Table
        columns={columns}
        dataSource={dataSource}
        onChange={handleTableChange}
        pagination={tableParams.pagination}
        loading={budgetDataMutation?.isPending}
      />
    </StyleWrapper>
  );
};

export default DataTable;
