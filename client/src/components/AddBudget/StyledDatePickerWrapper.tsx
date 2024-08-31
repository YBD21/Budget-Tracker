import styled from '@emotion/styled';

interface StyledDatePickerWrapperProps {
  error?: boolean;
}

const StyleWrapper = styled.div<StyledDatePickerWrapperProps>`
  &.light {
    .ant-picker-outlined {
      border: 2px solid black !important;
      border-radius: 6px !important;
      padding: 0.375rem 1rem !important;
      width: 100% !important;
    }

    .ant-picker-outlined:focus-within {
      outline: none !important;
      border-color: #1f2937;
      box-shadow: 0 0 0 2px rgba(156, 163, 175, 1) !important; /* Equivalent to ring-neutral-400 with ring width of 2px */
    }

    .ant-picker-outlined:focus-within {
      --tw-ring-opacity: 0.4 !important;
      box-shadow: 0 0 0 calc(2px + var(--tw-ring-offset-width))
        rgba(0, 0, 0, var(--tw-ring-opacity)) !important;
    }

    .ant-picker-outlined:active {
      --tw-ring-offset-shadow: 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color) !important;
      --tw-ring-shadow: 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color) !important;
      box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000) !important;
    }

    .ant-picker-outlined:hover {
      border-color: #000000 !important;
    }

    .ant-picker-input > input {
      color: #000000 !important;
    }

    .ant-picker-suffix {
      color: #000000 !important;
    }

    .ant-picker-panel {
      background-color: #ffffff !important;
    }

    .ant-picker-panel-header {
      background-color: #ffffff !important;
    }

    .ant-picker-cell-in-view {
      color: #000000 !important;
    }

    .ant-picker-cell-selected {
      background-color: #e6e6e6 !important;
      color: #000000 !important;
    }

    .ant-picker-cell:hover {
      background-color: #f2f2f2 !important;
      color: #000000 !important;
    }

    .ant-picker-cell-active {
      background-color: #cccccc !important;
      color: #000000 !important;
    }
  }

  /* Dark mode styles */
  &.dark {
    .ant-picker-outlined {
      border: 2px solid rgb(163 163 163) !important;
      border-radius: 6px !important;
      padding: 0.375rem 1rem !important;
      width: 100% !important;
      background-color: rgb(64 64 64) !important;
      outline: none !important;
    }

    .ant-picker-outlined:focus-within {
      outline: none !important;
      border-color: #737373 !important; /* Equivalent to neutral-500 */
      box-shadow: 0 0 0 2px rgba(156, 163, 175, 1) !important; /* Equivalent to ring-neutral-400 with ring width of 2px */
    }

    .ant-picker-outlined:focus-within {
      --tw-ring-opacity: 0.4 !important;
      box-shadow: 0 0 0 calc(2px + var(--tw-ring-offset-width))
        rgba(156, 163, 175, var(--tw-ring-opacity)) !important;
    }

    .ant-picker-outlined:active {
      --tw-ring-offset-shadow: 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color) !important;
      --tw-ring-shadow: 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color) !important;
      box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000) !important;
    }

    .ant-picker-input > input {
      color: #ffffff !important;
    }

    .ant-picker-suffix {
      color: #ffffff !important;
    }

    .ant-picker-panel {
      background-color: #1f1f1f !important;
    }

    .ant-picker-panel-header {
      background-color: #333333 !important;
    }

    .ant-picker-cell-in-view {
      color: #ffffff !important;
    }

    .ant-picker-cell-selected {
      background-color: #333333 !important;
      color: #ffffff !important;
    }

    .ant-picker-cell:hover {
      background-color: #555555 !important;
      color: #ffffff !important;
    }

    .ant-picker-cell-active {
      background-color: #777777 !important;
      color: #ffffff !important;
    }
  }
`;

export default StyleWrapper;
