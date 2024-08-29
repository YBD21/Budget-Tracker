import styled from '@emotion/styled';

interface StyledDatePickerWrapperProps {
  error?: boolean;
  darkMode?: boolean;
}

const StyleWrapper = styled.div<StyledDatePickerWrapperProps>`
  .ant-picker {
    border: 2px solid black;
    border-radius: 6px;
    padding: 0.375rem 1rem;
    width: 100%;
    color: #000000;

    &:hover {
      border-color: #000000;
    }

    &:focus,
    &:active {
      border-color: #000000;
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.4);
    }
  }

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
    .ant-picker {
      background-color: #e6e6e6;
      color: #ffffff;
      border-color: #ffffff;

      &:hover {
        border-color: #ffffff;
      }

      &:focus,
      &:active {
        border-color: #ffffff;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.4);
      }
    }

    .ant-picker-outlined:focus-within {
      border-color: #ffffff;
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
