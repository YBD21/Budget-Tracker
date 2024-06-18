'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import SearchIcon from '@mui/icons-material/Search'

import { LOGIN } from '@/constants/Routes'
import ToggleTheme from '../ToggleTheme'
import Button from '../Button'
import ErrorMessage from '../ErrorMessage'
import Recaptcha from '../Recaptcha'
import { useAuthUser } from '@/hooks/user/useAuthUser'
import FindAccountErrorBox from '../MessageBox/FindAccountErrorBox'
import { pagesOptions } from '.'

const FindAccount = ({ togglePage, setEmailToParent }) => {
  const [recapchaStatus, setRecapchaStatus] = useState(false)
  const [isDisable, setIsDisable] = useState(true)
  const [error, setError] = useState(null) // capture error with this state

  const { verifyCaptchaMutation, findAccountMutation } = useAuthUser()

  const formSchema = Yup.object({
    email: Yup.string().email().required('Email is required !'),
  })

  const validationOpt = {
    resolver: yupResolver(formSchema),
  }

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm(validationOpt)

  const handleClearErrors = () => {
    // Clear errors when input value changes
    clearErrors()
  }

  const switchToVerifyOTP = (email) => {
    togglePage(pagesOptions[1])
    setEmailToParent(email)
  }

  const handleChangeRecapcha = async (response) => {
    setError(null) // initial on every click
    const data = {
      response: response,
    }
    try {
      const respond = await verifyCaptchaMutation.mutateAsync(data)

      if (respond?.status) {
        setRecapchaStatus(true)
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.error_message || err?.message
      setError(errorMessage)
      console.log(errorMessage) // Network Error
    }
  }

  const handelFindAccountSubmit = async (data) => {
    setError(null) // initial on every click

    const userData = {
      email: data.email,
    }

    try {
      const respond = await findAccountMutation.mutateAsync(userData)
      if (respond.status) {
        switchToVerifyOTP(data.email)
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.error_message || err?.message
      setError(errorMessage)
      // console.log(errorMessage) // Network Error
    }
  }

  useEffect(() => {
    // const emailStatus = formSchema.isValidSync({ email: getValues('email') })

    if (recapchaStatus) {
      setIsDisable(false)
    }
  }, [recapchaStatus])

  return (
    <div className="flex flex-col justify-center min-h-screen">
      <div className="relative w-full p-6 mb-auto mx-auto mt-32 rounded-md sm:max-w-lg">
        <ToggleTheme />
        <h2 className="text-3xl font-semibold text-center text-black mb-6 dark:text-neutral-300">
          Find Account
        </h2>

        <form className="mt-4" onSubmit={handleSubmit(handelFindAccountSubmit)}>
          <div className="mb-2">
            <label className="block text-sm font-semibold text-gray-800 py-2 dark:text-neutral-300">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              autoComplete="auto-complete"
              placeholder={'example@email.com'}
              onChange={handleClearErrors}
              className={`
              ${errors?.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-black focus:border-black focus:ring-black dark:border-neutral-400 dark:focus:border-neutral-500 dark:focus:ring-neutral-400'}
              block w-full px-4 py-1.5 mt-2.5  border-2 rounded-md  focus:outline-none focus:ring focus:ring-opacity-40 placeholder:text-sm dark:bg-neutral-700`}
            />
            <ErrorMessage errorName={errors?.email} />
          </div>

          <div className="flex justify-center mt-4">
            <Recaptcha onChange={handleChangeRecapcha} />
          </div>

          {/* Error Message Box*/}
          {error && <FindAccountErrorBox message={error} />}

          {/* ReCapcha */}
          <div className="min-w-max mt-4">
            {/* Search */}
            <Button
              title={
                <div className="flex justify-center text-base dark:text-white">
                  <SearchIcon className="scale-125 mr-2" /> Search
                </div>
              }
              isDisable={isDisable}
              isPending={findAccountMutation.isPending}
              type="primary"
            />
          </div>
        </form>

        <div className="mt-5">
          <p className="text-center text-sm text-black dark:text-white">
            Return to Login ? &nbsp;
            <Link
              href={LOGIN}
              className="font-semibold leading-6 text-[#300] hover:underline dark:text-gray-300 decoration-2"
            >
              Click Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default FindAccount
