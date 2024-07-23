import { useCallback, useEffect, useState } from 'react';
import { Table } from 'antd';
import type { GetProp, TableColumnsType, TablePaginationConfig, TableProps } from 'antd';
import { SorterResult } from 'antd/es/table/interface';
import { useThemeStore } from '@/context/Store';
import StyleWrapper from './StyleWrapper';
import ActionTab from './ActionTab';

interface DataType {
  key: React.Key;
  date: string;
  title: string;
  type: string;
  reoccur: boolean;
  amount: number;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>['field'];
  sortOrder?: SorterResult<any>['order'];
  filters?: Parameters<GetProp<TableProps<DataType>, 'onChange'>>[1];
}

const styleIncome = (
  <span className="text-green-600 dark:text-green-500 text-center font-semibold">Income </span>
);

const styleYes = (
  <span className="text-green-600 dark:text-green-500 text-center font-semibold">Yes </span>
);

const styleExpense = (
  <span className="text-red-600 dark:text-red-500 text-center font-semibold">Expense</span>
);

const styleNo = (
  <span className="text-red-600 dark:text-red-500 text-center font-semibold">No</span>
);

const columns: TableColumnsType<DataType> = [
  {
    title: 'Date',
    dataIndex: 'date',
    sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    sortDirections: ['descend'],
  },
  {
    title: 'Title',
    dataIndex: 'title',
    sorter: (a, b) => a.title.length - b.title.length,
    sortDirections: ['descend'],
  },
  {
    title: 'Type',
    dataIndex: 'type',
    filters: [
      { text: styleIncome, value: 'Income' },
      { text: styleExpense, value: 'Expense' },
    ],
    onFilter: (value, record) => record.type === value,
    render: (type) => (type === 'Income' ? styleIncome : styleExpense),
  },
  {
    title: 'Reoccur',
    dataIndex: 'reoccur',
    filters: [
      { text: 'Yes', value: true },
      { text: 'No', value: false },
    ],
    onFilter: (value, record) => record.reoccur === value,
    render: (reoccur) => (reoccur ? styleYes : styleNo),
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    sorter: (a, b) => a.amount - b.amount,
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
    render: (_, record) => <ActionTab record={record} />,
  },
];

const DataTable: React.FC = () => {
  const { theme } = useThemeStore();
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 5,
      showSizeChanger: false,
    },
  });

  const generateDataSource = useCallback(
    (length: number) =>
      Array.from<DataType>({ length }).map<DataType>((_, i) => ({
        key: i,
        date: `2023-07-${i + 1}`,
        title: `Transaction ${i}`,
        type: i % 2 === 0 ? 'Income' : 'Expense',
        reoccur: i % 2 === 0,
        amount: Math.floor(Math.random() * (99999 - 1000 + 1)) + 1000,
      })),
    []
  );

  const handleTableChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    });
  };

  useEffect(() => {
    // Client-side data generation or fetching
    setDataSource(generateDataSource(20));
  }, []);

  useEffect(() => {
    const { pagination, sortField, sortOrder, filters } = tableParams;
    console.log(pagination);
    console.log('sortField :', sortField);
    console.log('sortOrder :', sortOrder);
    console.log('filters :', filters);
  }, [tableParams]);

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
