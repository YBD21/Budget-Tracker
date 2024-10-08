/* eslint-disable tailwindcss/migration-from-tailwind-2 */

import { MouseEventHandler, ReactNode } from 'react';

type ButtonProps = {
  title: string | ReactNode;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
  isDisable?: boolean;
  type?: 'primary' | 'error';
  small?: boolean;
  isPending?: boolean;
};

function Button({ title, handleClick, isDisable, type, small, isPending }: ButtonProps) {
  let buttonStyle;
  switch (type) {
    case 'primary':
      buttonStyle = `${'bg-black text-white focus:ring-black active:ring-black hover:ring-black dark:bg-neutral-600 dark:focus:ring-neutral-400 dark:active:ring-neutral-400 dark:hover:ring-neutral-400 dark:border dark:border-neutral-400'}`;
      break;

    case 'error':
      buttonStyle = `bg-red-900 dark:bg-red-800 rounded-lg focus:ring-red-500 active:ring-red-500 hover:ring-red-400 dark:border dark:border-red-800 hover:ring-2 hover:ring-opacity-50 focus:outline-none focus:ring-2 focus:ring-opacity-50 active:ring-4 active:ring-opacity-50 text-white`;
      break;

    default:
      buttonStyle = `border border-gray-300 dark:border-gray-400 bg-gray-100 dark:bg-neutral-600 text-black focus:ring-gray-300 active:ring-gray-300 hover:ring-gray-400 dark:bg-neutral-500 dark:text-white dark:border-neutral-700 dark:hover:border-neutral-600 dark:focus:ring-neutral-500 dark:active:ring-neutral-500 dark:hover:ring-neutral-400`;
      break;
  }
  return (
    <button
      disabled={isDisable || isPending}
      id="button"
      onClick={handleClick}
      className={`${buttonStyle} ${small ? 'text-sm' : 'text-base'}  mb-2 mr-2  w-full rounded-lg px-5  text-center font-medium tracking-wide hover:ring-2 hover:ring-opacity-50  focus:outline-none focus:ring-2  focus:ring-opacity-50 active:ring-4 active:ring-opacity-50  ${isDisable ? 'cursor-not-allowed py-2 opacity-60' : isPending ? 'cursor-progress py-1.5' : 'cursor-pointer py-2'}
      `}
    >
      <div className="flex items-center justify-center">
        {isPending && (
          <svg
            fill="none"
            className="size-8 animate-spin"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z"
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
        )}
        {title}
      </div>
    </button>
  );
}

export default Button;
