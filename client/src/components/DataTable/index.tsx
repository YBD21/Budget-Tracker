import { useCallback, useEffect, useState } from 'react';
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

const styleIncome = (
  <span className="text-green-600 dark:text-green-500 text-center font-semibold">Income </span>
);

const styleExpense = (
  <span className="text-red-600 dark:text-red-500 text-center font-semibold">Expense</span>
);

const yearly = (
  <span className="text-gray-700 dark:text-gray-300 text-center font-semibold">Yearly</span>
);

const monthly = (
  <span className="text-blue-500 dark:text-blue-400 text-center font-semibold">Monthly</span>
);

const once = (
  <span className="text-stone-600 dark:text-stone-400 text-center font-semibold">Once</span>
);

const columns: TableColumnsType<DataType> = [
  {
    title: 'Date',
    dataIndex: 'date',
    align: 'center',
    sorter: true,
    sortDirections: ['descend'],
  },
  {
    title: 'Title',
    dataIndex: 'title',
    align: 'center',
    sorter: true,
    sortDirections: ['descend'],
  },
  {
    title: 'Type',
    dataIndex: 'type',
    align: 'center',
    filters: [
      { text: styleIncome, value: 'Income' },
      { text: styleExpense, value: 'Expense' },
    ],
    onFilter: (value, record) => record.type === value,
    render: (type) => (type === 'Income' ? styleIncome : styleExpense),
    filterMultiple: false,
  },
  {
    title: 'Reoccur',
    dataIndex: 'reoccur',
    align: 'center',
    filters: [
      { text: yearly, value: 'Year' },
      { text: monthly, value: 'Month' },
      { text: once, value: 'Once' },
    ],
    onFilter: (value, record) => record.reoccur === value,
    render: (reoccur) => {
      if (reoccur === 'Year') {
        return yearly;
      } else if (reoccur === 'Month') {
        return monthly;
      }
      return once;
    },
    filterMultiple: false,
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    align: 'center',
    sorter: true,
    sortDirections: ['descend', 'ascend'],

    render: (amount) => {
      // Format the amount with commas
      const formattedAmount = new Intl.NumberFormat('en-IN', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
      return `Rs. ${formattedAmount}`;
    },
  },
  {
    title: 'Action',
    dataIndex: 'action',
    align: 'center',
    render: (_, record) => <ActionTab record={record} />,
  },
];

const DataTable: React.FC = () => {
  const { theme } = useThemeStore();
  const { userData } = useUserStore();
  const { budgetDataMutation } = useUserAction();

  const [dataSource, setDataSource] = useState<DataType[]>([]);

  const fetchData = async () => {
    try {
      const { pagination, sortField, sortOrder, filters } = tableParams;
      // console.log(pagination);
      // console.log('sortField :', sortField);
      // console.log('sortOrder :', sortOrder);
      // console.log('filters :', filters);

      const mutateData = {
        params: { pagination, sortField, sortOrder, filters },
      };
      const budgetData = await budgetDataMutation.mutateAsync(mutateData);
      console.log(budgetData.length);
      setDataSource(budgetData);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle the error, e.g., show an alert, log to an external service, etc.
    }
  };

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 5,
      showSizeChanger: false,
      total: userData?.totalPage,
    },
  });

  useEffect(() => {
    fetchData();
  }, [tableParams]);

  const handleTableChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    });
  };

  return (
    <StyleWrapper className={`${theme === 'dark' ? 'dark' : 'light'} rounded-lg`}>
      <Table
        columns={columns}
        dataSource={dataSource}
        onChange={handleTableChange}
        pagination={tableParams.pagination}
      />
    </StyleWrapper>
  );
};

export default DataTable;
