import styled from '@emotion/styled';

interface StyledDatePickerWrapperProps {
  error?: boolean;
}

// background-color: rgb(64 64 64);

const StyleWrapper = styled.div<StyledDatePickerWrapperProps>`
  // .ant-picker {
  //   border: 2px solid black;
  //   border-radius: 6px;
  //   padding: 0.375rem 1rem;
  //   width: 100%;
  //   color: #000000;

  //   &:hover {
  //     border-color: #000000;
  //   }

  //   &:focus,
  //   &:active {
  //     border-color: #000000;
  //     box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.4);
  //   }
  // }

  &.light {
    .ant-picker-outlined:focus-within {
      border-color: #000000;
    }

    .ant-picker-input > input {
      color: #000000;
    }

    .ant-picker-suffix {
      color: #000000;
    }

    .ant-picker-panel {
      background-color: #ffffff;
    }

    .ant-picker-panel-header {
      background-color: #ffffff;
    }

    .ant-picker-cell-in-view {
      color: #000000;
    }

    .ant-picker-cell-selected {
      background-color: #e6e6e6;
      color: #000000;
    }

    .ant-picker-cell:hover {
      background-color: #f2f2f2;
      color: #000000;
    }

    .ant-picker-cell-active {
      background-color: #cccccc;
      color: #000000;
    }
  }

  /* Dark mode styles */
  &.dark {
    .ant-picker-outlined {
      border: 2px solid rgb(163 163 163);
      border-radius: 6px;
      padding: 0.375rem 1rem;
      width: 100%;
      background-color: rgb(64 64 64) !important;
      outline: none;
    }

    .ant-picker-outlined:focus {
      outline: none;
      border-color: #737373; /* Equivalent to neutral-500 */
      box-shadow: 0 0 0 2px rgba(156, 163, 175, 1); /* Equivalent to ring-neutral-400 with ring width of 2px */
    }

    .ant-picker-outlined:focus {
      --tw-ring-opacity: 0.4;
      box-shadow: 0 0 0 calc(2px + var(--tw-ring-offset-width))
        rgba(156, 163, 175, var(--tw-ring-opacity));
    }

    .ant-picker-outlined:active {
      --tw-ring-offset-shadow: 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
      --tw-ring-shadow: 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
      box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
    }

    .ant-picker-input > input {
      color: #ffffff;
    }

    .ant-picker-suffix {
      color: #ffffff;
    }

    .ant-picker-panel {
      background-color: #1f1f1f;
    }

    .ant-picker-panel-header {
      background-color: #333333;
    }

    .ant-picker-cell-in-view {
      color: #ffffff;
    }

    .ant-picker-cell-selected {
      background-color: #333333;
      color: #ffffff;
    }

    .ant-picker-cell:hover {
      background-color: #555555;
      color: #ffffff;
    }

    .ant-picker-cell-active {
      background-color: #777777;
      color: #ffffff;
    }
  }
`;

export default StyleWrapper;
