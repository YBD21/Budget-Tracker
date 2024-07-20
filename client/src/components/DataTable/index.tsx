import { useState } from 'react';
import { Table, Button } from 'antd';
import type { GetProp, TableColumnsType, TablePaginationConfig, TableProps } from 'antd';
import { SorterResult } from 'antd/es/table/interface';

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

const columns: TableColumnsType<DataType> = [
  {
    title: 'Date',
    dataIndex: 'date',
    sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Title',
    dataIndex: 'title',
    onFilter: (value, record) => record.title.indexOf(value as string) === 0,
    sorter: (a, b) => a.title.length - b.title.length,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Type',
    dataIndex: 'type',
    filters: [
      { text: <span className="text-green-600 text-center">Income </span>, value: 'Income' },
      { text: <span className="text-red-600 text-center">Expense</span>, value: 'Expense' },
    ],
    onFilter: (value, record) => record.type === value,
  },
  {
    title: 'Reoccur',
    dataIndex: 'reoccur',
    filters: [
      { text: 'Yes', value: true },
      { text: 'No', value: false },
    ],
    onFilter: (value, record) => record.reoccur === value,
    render: (reoccur) => (reoccur ? 'Yes' : 'No'),
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    sorter: (a, b) => a.amount - b.amount,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Action',
    dataIndex: 'action',
    render: (_, record) => <Button onClick={() => console.log(record.key)}>Edit</Button>,
  },
];

const dataSource = Array.from<DataType>({ length: 20 }).map<DataType>((_, i) => ({
  key: i,
  date: `2023-07-${i + 1}`,
  title: `Transaction ${i}`,
  type: i % 2 === 0 ? 'Income' : 'Expense',
  reoccur: i % 2 === 0,
  amount: Math.floor(Math.random() * 1000),
}));

const DataTable: React.FC = () => {
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 5,
    },
  });

  const handleTableChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    });
  };

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      onChange={handleTableChange}
      pagination={tableParams.pagination}
      className="dark:bg-gray-50 rounded-lg"
    />
  );
};

export default DataTable;
