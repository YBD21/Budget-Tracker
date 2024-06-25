/* eslint-disable tailwindcss/migration-from-tailwind-2 */
'use client';

import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import SearchIcon from '@mui/icons-material/Search';

import { LOGIN } from '@/constants/Routes';
import ToggleTheme from '../ToggleTheme';
import Button from '../Button';
import ErrorMessage from '../ErrorMessage';
import Recaptcha from '../Recaptcha';
import { useAuthUser } from '@/hooks/user/useAuthUser';
import { pagesOptions } from '.';
import FindAccountErrorBox from './FindAccountErrorBox';

type FindAccountProps = {
  togglePage: (name: string) => void;
  setEmailToParent: (emailName: string) => void;
};

type Inputs = {
  email: string;
};

const FindAccount: FC<FindAccountProps> = ({ togglePage, setEmailToParent }) => {
  const [recapchaStatus, setRecapchaStatus] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const [error, setError] = useState(null); // capture error with this state

  const { verifyCaptchaMutation, findAccountMutation } = useAuthUser();

  const formSchema = Yup.object({
    email: Yup.string().email().required('Email is required !'),
  });

  const validationOpt = {
    resolver: yupResolver(formSchema),
  };

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm(validationOpt);

  const handleClearErrors = () => {
    // Clear errors when input value changes
    clearErrors();
  };

  const switchToVerifyOTP = (email: string) => {
    togglePage(pagesOptions[1]);
    setEmailToParent(email);
  };

  const handleChangeRecapcha = async (response: any) => {
    setError(null); // initial on every click
    const data = {
      response,
    };
    try {
      const respond = await verifyCaptchaMutation.mutateAsync(data);

      if (respond?.status) {
        setRecapchaStatus(true);
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error_message || err?.message;
      setError(errorMessage);
      console.log(errorMessage); // Network Error
    }
  };

  const handelFindAccountSubmit: SubmitHandler<Inputs> = async (data) => {
    setError(null); // initial on every click

    const userData = {
      email: data.email,
    };

    try {
      const respond = await findAccountMutation.mutateAsync(userData);
      if (respond.status) {
        switchToVerifyOTP(data.email);
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error_message || err?.message;
      setError(errorMessage);
      // console.log(errorMessage) // Network Error
    }
  };

  useEffect(() => {
    // const emailStatus = formSchema.isValidSync({ email: getValues('email') })

    if (recapchaStatus) {
      setIsDisable(false);
    }
  }, [recapchaStatus]);

  return (
    <div className="flex min-h-screen flex-col justify-center">
      <div className="relative mx-auto mb-auto mt-32 w-full rounded-md p-6 sm:max-w-lg">
        <ToggleTheme />
        <h2 className="mb-6 text-center text-3xl font-semibold text-black dark:text-neutral-300">
          Find Account
        </h2>

        <form className="mt-4" onSubmit={handleSubmit(handelFindAccountSubmit)}>
          <div className="mb-2">
            <label className="block py-2 text-sm font-semibold text-gray-800 dark:text-neutral-300">
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
              mt-2.5 block w-full rounded-md border-2  px-4 py-1.5  placeholder:text-sm focus:outline-none focus:ring focus:ring-opacity-40 dark:bg-neutral-700`}
            />
            <ErrorMessage errorName={errors?.email} />
          </div>

          <div className="mt-4 flex justify-center">
            <Recaptcha onChange={handleChangeRecapcha} />
          </div>

          {/* Error Message Box */}
          {error && <FindAccountErrorBox message={error} />}

          {/* ReCapcha */}
          <div className="mt-4 min-w-max">
            {/* Search */}
            <Button
              title={
                <div className="flex justify-center text-base dark:text-white">
                  <SearchIcon className="mr-2 scale-125" /> Search
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

export default FindAccount;
