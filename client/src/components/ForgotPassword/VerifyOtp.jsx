'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import Button from '../Button'
import ToggleTheme from '../ToggleTheme'
import ErrorMessage from '../ErrorMessage'
import { pagesOptions } from '.'

const VerifyOtp = ({ email, togglePage }) => {
  const [isDisable, setIsDisable] = useState(true) // default true

  const MAX = 6

  const formSchema = Yup.object({
    otp: Yup.string()
      .required('Verification code is required!')
      .test(
        'otp',
        `Verification code must be ${MAX} characters!`,
        (val) => !isNaN(val) && val.toString().length === MAX,
      ),
  })

  const validationOpt = {
    resolver: yupResolver(formSchema),
  }

  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm(validationOpt)

  const handleClearErrors = () => {
    // Clear errors when input value changes
    clearErrors()
  }

  const cancelVerify = () => {
    togglePage(pagesOptions[0])
  }

  const handleVerifySubmit = async (data) => {
    console.log(data.otp)
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative w-full mb-auto mt-14 p-6  rounded-md sm:max-w-lg">
        <ToggleTheme />

        <p className=" font-semibold text-lg text-center text-black py-5 dark:text-neutral-300">
          Verification code was sent to{' '}
          <span className="font-medium text-[#300] dark:text-white">
            {email}
          </span>
        </p>
        {/* verify code */}
        <form className="mt-6">
          {/* Code Box */}
          <div className="mb-2">
            <label className="block text-sm font-semibold text-gray-800 dark:text-neutral-300">
              Verification code
            </label>
            <div className="flex flex-row cursor-pointer">
              <input
                {...register('otp')}
                type="number"
                onChange={handleClearErrors}
                className={`
                ${errors?.otp ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-black focus:border-black focus:ring-black dark:border-neutral-400 dark:focus:border-neutral-500 dark:focus:ring-neutral-400'}
                block w-full px-4 py-1.5 mt-2.5  border-2 rounded-md  focus:outline-none focus:ring focus:ring-opacity-40 placeholder:text-sm text-center dark:bg-neutral-700`}
              />
            </div>
            {/* Error Message */}
            <ErrorMessage errorName={errors?.otp} />
          </div>

          <div className="flex flex-row justify-between px-2.5 pt-2 pb-2">
            {/* Resend will only apper when verify code is generated in backend */}
            <button
              className="text-sm text-blue-600 font-semibold cursor-pointer hover:underline decoration-2 decoration-blue-600"
              // onClick={reSendEmail}
            >
              Resend Code
            </button>
            <button
              className="text-sm font-medium cursor-pointer hover:underline decoration-2  text-black dark:text-gray-300"
              onClick={cancelVerify}
            >
              Go Back
            </button>
          </div>

          {/* Display Error Message Box  */}
          {/* {error && (
            <ErrorMessageBoxVerify Error_message={error} status={true} />
          )} */}

          {/* Verify */}
          <div className="min-w-max mt-4">
            <Button
              title={'Verify'}
              type="primary"
              isDisable={isDisable}
              handleClick={handleSubmit(handleVerifySubmit)}
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default VerifyOtp
