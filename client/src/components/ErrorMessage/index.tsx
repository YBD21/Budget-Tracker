import React from 'react'

const ErrorMessage = ({ errorName }) => {
  if (errorName)
    return (
      <div className="flex flex-row pt-2.5 ml-1">
        <span className="text-red-600 text-sm">{errorName?.message}</span>
      </div>
    )
}

export default ErrorMessage
