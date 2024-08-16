import { useMemo } from 'react';
import type { TableColumnsType } from 'antd';
import ActionTab from './ActionTab';

export interface DataType {
  key: React.Key;
  date: string;
  title: string;
  type: string;
  reoccur: boolean;
  amount: number;
}

export const useColumns = (): TableColumnsType<DataType> => {
  return useMemo(
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
};
