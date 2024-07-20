import { useState } from 'react';
import { Table } from 'antd';
import type { GetProp, TableColumnsType, TablePaginationConfig, TableProps } from 'antd';
import { SorterResult } from 'antd/es/table/interface';

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>['field'];
  sortOrder?: SorterResult<any>['order'];
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    showSorterTooltip: { target: 'full-header' },
    // specify the condition of filtering result
    // here is that finding the name started with `value`
    onFilter: (value, record) => record.name.indexOf(value as string) === 0,
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ['descend'],
  },
  {
    title: 'Age',
    dataIndex: 'age',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    onFilter: (value, record) => record.address.indexOf(value as string) === 0,
  },
];

const dataSource = Array.from<DataType>({ length: 20 }).map<DataType>((_, i) => ({
  key: i,
  name: `Edward King ${i}`,
  age: i + 24,
  address: `London, Park Lane no. ${i}`,
}));

const DataTable: React.FC = () => {
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 5,
    },
  });

  const handleTableChange: TableProps['onChange'] = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      console.log('hello');
    }
  };

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      onChange={handleTableChange}
      showSorterTooltip={{ target: 'sorter-icon' }}
      pagination={tableParams.pagination}
    />
  );
};

export default DataTable;
