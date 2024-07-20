import { useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Table, Button } from 'antd';
import type { GetProp, TableColumnsType, TablePaginationConfig, TableProps } from 'antd';
import { SorterResult } from 'antd/es/table/interface';
import { useThemeStore } from '@/context/Store';

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

const styleIncome = <span className="text-green-600 text-center">Income </span>;
const styleYes = <span className="text-green-700 text-center">Yes </span>;
const styleExpense = <span className="text-red-600 text-center">Expense</span>;
const styleNo = <span className="text-red-700 text-center">No</span>;

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
    render: (_, record) => <Button onClick={() => console.log(record.key)}>Edit</Button>,
  },
];

const StyleWrapper = styled.div`
  &.dark {
    background-color: #1a1a1a; /* Dark background */
    color: #ffffff; /* Light text for dark mode */

    .ant-table {
      background-color: #1a1a1a;
      color: #ffffff;
    }

    .ant-table-thead > tr > th:hover {
      background-color: #333333 !important; /* Darker header for dark mode */
      color: #ffffff;
    }

    .ant-table-thead > tr > th {
      background-color: #333333; /* Darker header for dark mode */
      color: #ffffff;
      transition: none !important;
    }

    .ant-table-tbody > tr > td {
      background-color: #1a1a1a;
      color: #ffffff;
      transition: none !important;
    }

    .ant-pagination-item {
      background-color: #1a1a1a;
      border-color: #ffffff;
    }

    .ant-pagination-item > a {
      color: #ffffff !important;
    }

    .ant-pagination-item-active {
      border-color: #ffffff;
      background-color: #333333;
      color: #ffffff;
    }

    .ant-table-tbody > tr:hover {
      background-color: #333333; /* Slightly lighter background on hover */
    }

    .ant-table-tbody > tr:hover > td {
      color: #ffffff; /* Ensure text remains readable on hover */
    }

    .anticon {
      color: #ffffff;
    }

    .ant-table-cell-row-hover {
      background: none !important;
    }
  }

  &.light {
    background-color: #ffffff; /* Light background */
    color: #000000; /* Dark text for light mode */

    .ant-table {
      background-color: #ffffff;
      color: #000000;
    }

    .ant-table-thead > tr > th {
      background-color: #f0f0f0; /* Lighter header for light mode */
      color: #000000;
      transition: none !important;
    }

    .ant-table-tbody > tr > td {
      background-color: #ffffff;
      color: #000000;
      transition: none !important;
    }

    .ant-pagination-item {
      background-color: #ffffff;
      color: #000000;
      border-color: #000000;
    }

    .ant-pagination-item-active {
      border-color: #000000;
      background-color: #e6e6e6;
      color: #000000;
    }

    .ant-table-tbody > tr:hover {
      background-color: #e6e6e6; /* Slightly darker background on hover */
    }

    .ant-table-tbody > tr:hover > td {
      color: #000000; /* Ensure text remains readable on hover */
    }

    .ant-pagination-item > a {
      color: #000000 !important;
    }
  }
`;

const DataTable: React.FC = () => {
  const { theme } = useThemeStore();
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 5,
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

  return (
    <StyleWrapper className={`${theme === 'dark' ? 'dark' : 'light'} rounded-lg`}>
      <Table
        columns={columns}
        dataSource={dataSource}
        onChange={handleTableChange}
        pagination={tableParams.pagination}
        // className="dark:bg-gray-50 rounded-lg"
      />
    </StyleWrapper>
  );
};

export default DataTable;
