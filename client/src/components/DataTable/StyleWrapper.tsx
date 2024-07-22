import styled from '@emotion/styled';

const StyleWrapper = styled.div`
  &.dark {
    background-color: #1f1f1f; /* Dark background */
    color: #ffffff; /* Light text for dark mode */

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
      background-color: #1f1f1f;
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
    }

    .ant-pagination-item-container > span {
      color: #ffffff !important;
    }

    .ant-pagination-item-active:hover {
      border-color: #ffffff !important;
      background-color: #333333;
      color: #ffffff;
    }

    .ant-table-tbody > tr:hover {
      background-color: #333333; /* Slightly lighter background on hover */
    }

    .ant-table-tbody > tr:hover > td {
      color: #ffffff; /* Ensure text remains readable on hover */
    }

    .ant-dropdown-trigger {
      color: #ffffff;
    }

    .ant-table-cell-row-hover {
      background: none !important;
    }

    .active {
      color: #1677ff !important;
    }

    .ant-table {
      background: inherit !important;
    }

    .ant-table-column-sorter-inner {
      color: #ffffff;
    }

    .ant-pagination-prev > button > span {
      color: #ffffff !important;
    }

    .ant-pagination-next > button > span {
      color: #ffffff !important;
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

    .ant-pagination-item-container > span {
      color: #333333 !important;
    }
  }
`;

export default StyleWrapper;
