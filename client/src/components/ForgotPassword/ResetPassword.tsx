/* eslint-disable tailwindcss/migration-from-tailwind-2 */
'use client';

import { ChangeEvent, FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Tooltip } from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { LOGIN } from '@/constants/Routes';
import ToggleTheme from '../ToggleTheme';
import ErrorMessage from '../ErrorMessage';
import Button from '../Button';
import { useAuthUser } from '@/hooks/user/useAuthUser';
import ResetPasswordMessageBox from './ResetPasswordMessageBox';

type ResetPasswordProps = {
  email: string;
};

type Message = string | null;

type Inputs = {
  createPassword: string;
  confirmPassword: string;
};

const ResetPassword: FC<ResetPasswordProps> = ({ email }) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<Message>(null); // capture error with this state

  const { resetPasswordMutation } = useAuthUser();

  // handle toggle to show or hide password
  const toggle = () => {
    setOpen(!open);
  };

  const MAX = 16;
  const MIN_PASSWORD = 8;

  const formSchema = Yup.object({
    createPassword: Yup.string()
      .trim()
      .required('Create password is required !')
      .min(MIN_PASSWORD, `Create password must be at least ${MIN_PASSWORD} characters !`)
      .max(MAX, `Create password must be at most ${MAX} characters !`),

    confirmPassword: Yup.string()
      .trim()
      .required('Confirm password is required !')
      .test('passwords-match', 'Password does not match !', function (value) {
        return this.parent.createPassword === value;
      }),
  });

  const validationOpt = {
    resolver: yupResolver(formSchema),
  };

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm(validationOpt);

  const handleClearErrors = () => {
    // Clear errors when input value changes
    clearErrors();
  };

  const handleCreatePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const trimmedValue = e.target.value.trim();
    setValue('createPassword', trimmedValue);
    handleClearErrors();
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const trimmedValue = e.target.value.trim();
    setValue('confirmPassword', trimmedValue);
    handleClearErrors();
  };

  const redirectToLogin = () => {
    router.replace(LOGIN);
  };

  const handleResetPassword: SubmitHandler<Inputs> = async (data) => {
    setMessage(null); // initial on every click

    const resetData = {
      email,
      password: data.confirmPassword,
    };

    try {
      const respond = await resetPasswordMutation.mutateAsync(resetData);

      if (respond.status === true) {
        setMessage('ResetPassword');
        // wait timer of 2 sec and redirect
        setTimeout(redirectToLogin, 2000);
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error_message || err?.message;
      setMessage(errorMessage);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center overflow-hidden">
      <div className="relative mx-auto mb-auto mt-32 w-full rounded-md p-6 sm:max-w-lg">
        <ToggleTheme />
        <h2 className="text-center text-2xl font-semibold text-black dark:text-neutral-300">
          Reset Password
        </h2>

        {/* Resetpassword Form */}
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
              autoComplete="off"
              className={`
              mt-2.5 block w-full cursor-not-allowed rounded-md border-2 border-gray-500 px-4 py-1.5 text-gray-600 placeholder:text-sm focus:border-black focus:outline-none focus:ring focus:ring-black  focus:ring-opacity-40 dark:border-neutral-400 dark:bg-neutral-700 dark:text-gray-400  dark:focus:border-neutral-500 dark:focus:ring-neutral-400 `}
            />
          </div>

          {/* Password Input Box */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-800 dark:text-neutral-300">
              Create Password
            </label>

            <div className="relative flex cursor-pointer flex-row">
              <input
                {...register('createPassword')}
                type={open === false ? 'password' : 'text'}
                placeholder={'Create password'}
                onChange={handleCreatePasswordChange}
                autoComplete="new-password"
                className={`
                ${errors?.createPassword ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-black focus:border-black focus:ring-black dark:border-neutral-400 dark:focus:border-neutral-500 dark:focus:ring-neutral-400'}
                mt-2.5 block w-full rounded-md border-2  px-4 py-1.5  placeholder:text-sm placeholder:text-gray-300 focus:outline-none focus:ring focus:ring-opacity-40 dark:bg-neutral-700`}
              />

              {/* hide/unhide password */}
              <div
                className={`absolute right-3.5 top-2.5 text-2xl ${errors.createPassword ? 'text-red-700' : 'text-black dark:text-white'} `}
              >
                {open === false ? (
                  <Tooltip title="Show">
                    <VisibilityIcon onClick={toggle} fontSize="small" />
                  </Tooltip>
                ) : (
                  <Tooltip title="Hide">
                    <VisibilityOffIcon onClick={toggle} fontSize="small" />
                  </Tooltip>
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

            <div className="relative flex cursor-pointer flex-row">
              <input
                {...register('confirmPassword')}
                autoComplete="confirm-password"
                placeholder={'Confirm password'}
                type={open === false ? 'password' : 'text'}
                onChange={handleConfirmPasswordChange}
                className={`
                ${errors?.confirmPassword ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-black focus:border-black focus:ring-black dark:border-neutral-400 dark:focus:border-neutral-500 dark:focus:ring-neutral-400'}
                mt-2.5 block w-full rounded-md border-2  px-4 py-1.5  placeholder:text-sm placeholder:text-gray-300 focus:outline-none focus:ring focus:ring-opacity-40 dark:bg-neutral-700`}
              />
              {/* hide/unhide password */}
              <div
                className={`absolute right-3.5 top-2.5 text-2xl ${errors.confirmPassword ? 'text-red-700' : 'text-black dark:text-white'} `}
              >
                {open === false ? (
                  <Tooltip title="Show">
                    <VisibilityIcon onClick={toggle} fontSize="small" />
                  </Tooltip>
                ) : (
                  <Tooltip title="Hide">
                    <VisibilityOffIcon onClick={toggle} fontSize="small" />
                  </Tooltip>
                )}
              </div>
            </div>
            {/* Error Message */}
            <ErrorMessage errorName={errors?.confirmPassword} />
          </div>

          {/* Message Box */}

          {message && <ResetPasswordMessageBox message={message} />}

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
              className="font-semibold leading-6 text-[#300] decoration-2 hover:underline dark:text-gray-300"
            >
              Click Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
