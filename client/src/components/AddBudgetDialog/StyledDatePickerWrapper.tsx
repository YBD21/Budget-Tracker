import styled from '@emotion/styled';

interface StyledDatePickerWrapperProps {
  error?: boolean;
}

const StyleWrapper = styled.div<StyledDatePickerWrapperProps>`
  --border-light: ${(props) => (props.error ? '#f87171' : 'black')};
  --border-dark: ${(props) => (props.error ? '#f87171' : 'rgb(163 163 163)')};
  --focus-border-light: ${(props) => (props.error ? '#f87171' : '#1f2937')};
  --focus-border-dark: ${(props) => (props.error ? '#f87171' : '#737373')};
  --text-color-light: #000000;
  --text-color-dark: #ffffff;
  --background-light: #ffffff;
  --background-dark: #1f1f1f;
  --header-background-dark: #333333;
  --cell-bg-light: #e6e6e6;
  --cell-bg-hover-light: #f2f2f2;
  --cell-bg-active-light: #cccccc;
  --cell-bg-dark: #333333;
  --cell-bg-hover-dark: #555555;
  --cell-bg-active-dark: #777777;
  --box-shadow-color: rgba(156, 163, 175, 1)
    ${(props) => (props.error ? '#f87171' : 'rgba(156, 163, 175, 1)')};

  &.light {
    .ant-picker-outlined {
      border: 2px solid var(--border-light) !important;
      border-radius: 6px !important;
      padding: 0.375rem 1rem !important;
      width: 100% !important;
      background-color: var(--background-light) !important;
    }

    .ant-picker-outlined:focus-within {
      border-color: var(--focus-border-light) !important;
      box-shadow: 0 0 0 2px var(--box-shadow-color) !important;
    }

    .ant-picker-outlined:active {
      box-shadow: 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color) !important;
    }

    .ant-picker-input > input {
      color: var(--text-color-light) !important;
    }

    .ant-picker-suffix {
      color: var(--text-color-light) !important;
    }

    .ant-picker-panel {
      background-color: var(--background-light) !important;
    }

    .ant-picker-panel-header {
      background-color: var(--background-light) !important;
    }

    .ant-picker-cell-in-view {
      color: var(--text-color-light) !important;
    }

    .ant-picker-cell-selected {
      background-color: var(--cell-bg-light) !important;
      color: var(--text-color-light) !important;
    }

    .ant-picker-cell:hover {
      background-color: var(--cell-bg-hover-light) !important;
      color: var(--text-color-light) !important;
    }

    .ant-picker-cell-active {
      background-color: var(--cell-bg-active-light) !important;
      color: var(--text-color-light) !important;
    }
  }

  &.dark {
    .ant-picker-outlined {
      border: 2px solid var(--border-dark) !important;
      border-radius: 6px !important;
      padding: 0.375rem 1rem !important;
      width: 100% !important;
      background-color: rgb(64 64 64) !important;
    }

    .ant-picker-outlined:focus-within {
      border-color: var(--focus-border-dark) !important;
      box-shadow: 0 0 0 2px var(--box-shadow-color) !important;
    }

    .ant-picker-outlined:active {
      box-shadow: 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color) !important;
    }

    .ant-picker-input > input {
      color: var(--text-color-dark) !important;
    }

    .ant-picker-suffix {
      color: var(--text-color-dark) !important;
    }

    .ant-picker-panel {
      background-color: var(--background-dark) !important;
    }

    .ant-picker-panel-header {
      background-color: var(--header-background-dark) !important;
    }

    .ant-picker-cell-in-view {
      color: var(--text-color-dark) !important;
    }

    .ant-picker-cell-selected {
      background-color: var(--cell-bg-dark) !important;
      color: var(--text-color-dark) !important;
    }

    .ant-picker-cell:hover {
      background-color: var(--cell-bg-hover-dark) !important;
      color: var(--text-color-dark) !important;
    }

    .ant-picker-cell-active {
      background-color: var(--cell-bg-active-dark) !important;
      color: var(--text-color-dark) !important;
    }
  }
`;

export default StyleWrapper;
