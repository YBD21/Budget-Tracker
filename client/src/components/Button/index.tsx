function Button({ title, handleClick, isDisable, type, small, isPending }) {
  let buttonStyle
  switch (type) {
    case 'primary':
      buttonStyle = `${'bg-black text-white focus:ring-black active:ring-black hover:ring-black dark:bg-neutral-600 dark:focus:ring-neutral-400 dark:active:ring-neutral-400 dark:hover:ring-neutral-400 dark:border dark:border-neutral-400'}`
      break

    default:
      buttonStyle = `${'border border-gray-500 hover:border-gray-600  bg-gray-100 text-black focus:ring-gray-600 active:ring-gray-600 hover:ring-gray-500'}`
      break
  }
  return (
    <button
      disabled={isDisable || isPending}
      id="button"
      onClick={handleClick}
      className={`${buttonStyle} ${
        small ? 'text-sm' : 'text-base'
      }  w-full px-5  tracking-wide
 font-medium rounded-lg  text-center mr-2 mb-2
focus:outline-none focus:ring-2  focus:ring-opacity-50 active:ring-4  active:ring-opacity-50 hover:ring-2 hover:ring-opacity-50  ${isDisable ? 'cursor-not-allowed opacity-60 py-2' : isPending ? 'cursor-progress py-1.5' : 'cursor-pointer py-2'}
      `}
    >
      <div className="flex justify-center items-center">
        {isPending && (
          <svg
            fill="none"
            className="w-8 h-8 animate-spin"
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
  )
}

export default Button
