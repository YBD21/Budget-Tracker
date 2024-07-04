/* eslint-disable tailwindcss/migration-from-tailwind-2 */
'use client';

import { ChangeEvent, FC, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Tooltip } from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Button from '../Button';
import Link from 'next/link';
import { LOGIN } from '@/constants/Routes';
import ErrorMessage from '../ErrorMessage';
import ToggleTheme from '../ToggleTheme';
import { UserInfo } from '.';

type CreateAccountProps = {
  togglePage: (status: boolean) => void;
  setUserInfo: (data: UserInfo) => void;
};

type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
  createPassword: string;
  confirmPassword: string;
};

const CreateAccount: FC<CreateAccountProps> = ({ togglePage, setUserInfo }) => {
  const [open, setOpen] = useState(false);

  // handle toggle to show or hide password
  const toggle = () => {
    setOpen(!open);
  };

  const MIN_NAME = 2;
  const MAX = 16;
  const MIN_PASSWORD = 8;

  const formSchema = Yup.object({
    firstName: Yup.string()
      .trim()
      .required('First name is required !')
      .min(MIN_NAME, `First name must be at least ${MIN_NAME} characters !`)
      .max(MAX, `First name must be at most ${MAX} characters !`),
    lastName: Yup.string()
      .trim()
      .required('Last name is required !')
      .min(MIN_NAME, `Last name must be at least ${MIN_NAME} characters !`)
      .max(MAX, `Last name must be at most ${MAX} characters !`),
    email: Yup.string().email().required('Email is required !'),
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

  const handleFirstNameOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const trimmedValue = e.target.value.trim();
    setValue('firstName', trimmedValue);
    handleClearErrors();
  };

  const handleLastNameOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const trimmedValue = e.target.value.trim();
    setValue('lastName', trimmedValue);
    handleClearErrors();
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

  const handleCreateAccountSubmit: SubmitHandler<Inputs> = async (data) => {
    const userData = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.confirmPassword,
    };

    setUserInfo(userData);

    togglePage(true);
  };

  return (
    <div className="flex min-h-screen flex-col justify-center overflow-hidden dark:bg-neutral-800">
      <div
        className={`relative mx-auto mb-auto w-full rounded-md p-6 sm:max-w-lg ${
          Object.keys(errors).length > 0 ? 'mt-4' : 'mt-12'
        }`}
      >
        <ToggleTheme />
        <h2 className="py-5 text-center text-3xl font-semibold text-black dark:text-neutral-300">
          Create Your Account
        </h2>
        {/* Signup Form */}
        <form className="mt-2" onSubmit={handleSubmit(handleCreateAccountSubmit)}>
          {/* First Name */}
          <div className="mb-2">
            <label className="block text-sm font-semibold text-gray-800 dark:text-neutral-300">
              First name
            </label>
            <div className="flex cursor-pointer flex-row">
              <input
                {...register('firstName')}
                type="text"
                placeholder={'What is your first name ?'}
                onChange={handleFirstNameOnChange}
                className={`
                ${errors?.firstName ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-black focus:border-black focus:ring-black dark:border-neutral-400 dark:focus:border-neutral-500 dark:focus:ring-neutral-400'}
                mt-2.5 block w-full rounded-md border-2  px-4 py-1.5  placeholder:text-sm focus:outline-none focus:ring focus:ring-opacity-40 dark:bg-neutral-700`}
              />
            </div>
            <ErrorMessage errorName={errors?.firstName} />
          </div>
          {/* Last Name  */}
          <div className="mb-2">
            <label className="block text-sm font-semibold text-gray-800 dark:text-neutral-300">
              Last name
            </label>

            <div className="flex cursor-pointer flex-row">
              <input
                {...register('lastName')}
                type="text"
                placeholder={'What is your last name ?'}
                onChange={handleLastNameOnChange}
                className={`
                ${errors?.lastName ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-black focus:border-black focus:ring-black dark:border-neutral-400 dark:focus:border-neutral-500 dark:focus:ring-neutral-400'}
                mt-2.5 block w-full rounded-md border-2  px-4 py-1.5  placeholder:text-sm focus:outline-none focus:ring focus:ring-opacity-40 dark:bg-neutral-700`}
              />
            </div>
            <ErrorMessage errorName={errors?.lastName} />
          </div>
          {/* Email */}
          <div className="mb-2">
            <label className="block text-sm font-semibold text-gray-800 dark:text-neutral-300">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              autoComplete="e-mail"
              placeholder={'example@email.com'}
              onChange={handleClearErrors}
              className={`
              ${errors?.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-black focus:border-black focus:ring-black dark:border-neutral-400 dark:focus:border-neutral-500 dark:focus:ring-neutral-400'}
              mt-2.5 block w-full rounded-md border-2  px-4 py-1.5  placeholder:text-sm focus:outline-none focus:ring focus:ring-opacity-40 dark:bg-neutral-700`}
            />
            <ErrorMessage errorName={errors?.email} />
          </div>
          {/* Create password */}
          <div className="mb-2">
            <label className="block text-sm font-semibold text-gray-800 dark:text-neutral-300">
              Create password
            </label>

            <div className="relative flex cursor-pointer flex-row">
              <input
                {...register('createPassword')}
                autoComplete="new-password"
                type={open === false ? 'password' : 'text'}
                placeholder={'Create password'}
                onChange={handleCreatePasswordChange}
                className={`
                ${errors?.createPassword ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-black focus:border-black focus:ring-black dark:border-neutral-400 dark:focus:border-neutral-500 dark:focus:ring-neutral-400'}
                mt-2.5 block w-full rounded-md border-2  px-4 py-1.5  placeholder:text-sm focus:outline-none focus:ring focus:ring-opacity-40 dark:bg-neutral-700`}
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
            <ErrorMessage errorName={errors?.createPassword} />
          </div>

          {/* Confirm password */}
          <div className="mb-2">
            <label className="block text-sm font-semibold text-gray-800 dark:text-neutral-300">
              Confirm password
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
                mt-2.5 block w-full rounded-md border-2  px-4 py-1.5  placeholder:text-sm focus:outline-none focus:ring focus:ring-opacity-40 dark:bg-neutral-700`}
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
            <ErrorMessage errorName={errors?.confirmPassword} />
          </div>
          <div className="mt-8">
            <Button title="Create Account" type="primary" />
          </div>
          {/*  */}
        </form>
        <div className="mt-5">
          <p className="text-center text-sm text-black dark:text-white">
            Already a member ? &nbsp;
            <Link
              href={LOGIN}
              className="font-semibold leading-6 text-[#300] decoration-2 hover:underline dark:text-gray-300"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
