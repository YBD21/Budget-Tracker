'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { LOGIN } from '@/constants/Routes'
import ToggleTheme from '../ToggleTheme'
import ErrorMessage from '../ErrorMessage'
import Button from '../Button'
import { useAuthUser } from '@/hooks/user/useAuthUser'

const ResetPassword = ({ email }) => {
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [error, setError] = useState(null) // capture error with this state

  const { resetPasswordMutation } = useAuthUser()

  // handle toggle to show or hide password
  const toggle = () => {
    setOpen(!open)
  }

  const MAX = 16
  const MIN_PASSWORD = 8

  const formSchema = Yup.object({
    createPassword: Yup.string()
      .trim()
      .required('Create password is required !')
      .min(
        MIN_PASSWORD,
        `Create password must be at least ${MIN_PASSWORD} characters !`,
      )
      .max(MAX, `Create password must be at most ${MAX} characters !`),

    confirmPassword: Yup.string()
      .trim()
      .required('Confirm password is required !')
      .test('passwords-match', 'Password does not match !', function (value) {
        return this.parent.createPassword === value
      }),
  })

  const validationOpt = {
    resolver: yupResolver(formSchema),
  }

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm(validationOpt)

  const handleClearErrors = () => {
    // Clear errors when input value changes
    clearErrors()
  }

  const handleCreatePasswordChange = (e) => {
    const trimmedValue = e.target.value.trim()
    setValue('createPassword', trimmedValue)
    handleClearErrors()
  }

  const handleConfirmPasswordChange = (e) => {
    const trimmedValue = e.target.value.trim()
    setValue('confirmPassword', trimmedValue)
    handleClearErrors()
  }

  const redirectToLogin = () => {
    router.replace(LOGIN)
  }

  const handleResetPassword = async (data) => {
    setError(null) // initial on every click
    console.log(data.confirmPassword)

    const resetData = {
      email: data.email,
      password: data.confirmPassword,
    }

    try {
      const respond = await resetPasswordMutation.mutateAsync(resetData)

      if (respond.status === true) {
        // wait timer of 2 sec and redirect
        setTimeout(redirectToLogin, 2000)
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.error_message || err?.message
      setError(errorMessage)
    }
  }

  return (
    <div className="flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="relative w-full p-6 mb-auto mx-auto mt-32 rounded-md sm:max-w-lg">
        <ToggleTheme />
        <h2 className="text-2xl font-semibold text-center text-black dark:text-neutral-300">
          Reset Password
        </h2>

        {/* Resetpassword Form*/}
        <form className="mt-8" onSubmit={handleSubmit(handleResetPassword)}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-800 dark:text-neutral-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className={`
              border-gray-500 focus:border-black focus:ring-black dark:border-neutral-400 dark:focus:border-neutral-500 dark:focus:ring-neutral-400 block w-full px-4 py-1.5 mt-2.5 dark:text-gray-400 text-gray-600 border-2 rounded-md  focus:outline-none focus:ring focus:ring-opacity-40 placeholder:text-sm  cursor-not-allowed dark:bg-neutral-700 `}
            />
            <ErrorMessage errorName={errors?.email} />
          </div>

          {/* Password Input Box */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-800 dark:text-neutral-300">
              Create Password
            </label>

            <div className="relative flex flex-row cursor-pointer">
              <input
                {...register('createPassword')}
                type={open === false ? 'password' : 'text'}
                placeholder={'Create password'}
                onChange={handleCreatePasswordChange}
                autoComplete="new-password"
                className={`
                ${errors?.createPassword ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-black focus:border-black focus:ring-black dark:border-neutral-400 dark:focus:border-neutral-500 dark:focus:ring-neutral-400'}
                block w-full px-4 py-1.5 mt-2.5  border-2 rounded-md  focus:outline-none focus:ring focus:ring-opacity-40 placeholder:text-sm placeholder:text-gray-300 dark:bg-neutral-700`}
              />

              {/* hide/unhide password */}
              <div
                className={`absolute text-2xl top-2.5 right-3.5 ${errors.password ? 'text-red-700' : 'text-black dark:text-white'} `}
              >
                {open === false ? (
                  <VisibilityIcon onClick={toggle} fontSize="small" />
                ) : (
                  <VisibilityOffIcon onClick={toggle} fontSize="small" />
                )}
              </div>
            </div>
            {/* Error Message */}
            <ErrorMessage errorName={errors?.createPassword} />
          </div>

          {/* Confirm Password Input Box */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-800 dark:text-neutral-300">
              Confirm Password
            </label>

            <div className="relative flex flex-row cursor-pointer">
              <input
                {...register('confirmPassword')}
                autoComplete="confirm-password"
                placeholder={'Confirm password'}
                type={open === false ? 'password' : 'text'}
                onChange={handleConfirmPasswordChange}
                className={`
                ${errors?.confirmPassword ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-black focus:border-black focus:ring-black dark:border-neutral-400 dark:focus:border-neutral-500 dark:focus:ring-neutral-400'}
                block w-full px-4 py-1.5 mt-2.5  border-2 rounded-md  focus:outline-none focus:ring focus:ring-opacity-40 placeholder:text-sm placeholder:text-gray-300 dark:bg-neutral-700`}
              />
              {/* hide/unhide password */}
              <div
                className={`absolute text-2xl top-2.5 right-3.5 ${errors.password ? 'text-red-700' : 'text-black dark:text-white'} `}
              >
                {open === false ? (
                  <VisibilityIcon onClick={toggle} fontSize="small" />
                ) : (
                  <VisibilityOffIcon onClick={toggle} fontSize="small" />
                )}
              </div>
            </div>
            {/* Error Message */}
            <ErrorMessage errorName={errors?.confirmPassword} />
          </div>

          {/* Error Message Box */}

          {/* {error && (
            <ErrorMessageBoxForgorPassword
              Error_message={error}
              status={true}
            />
          )} */}

          {/* Success Message Box */}
          {/* {success && <SuccessMessageBox props={success} status={true} />} */}

          <div className="pt-5">
            <Button title="Reset Password" type="primary" />
          </div>
        </form>

        <div className="mt-5">
          <p className="text-center text-sm text-gray-800 dark:text-white">
            Return to Login ? &nbsp;
            <Link
              href={LOGIN}
              replace={true}
              className="font-semibold leading-6 text-[#300] dark:text-gray-300 decoration-2 hover:underline"
            >
              Click Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
