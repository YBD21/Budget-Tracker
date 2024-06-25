'use client';
import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { FORGOTPASSWORD, HOME, SIGNUP } from '@/constants/Routes';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Button from '../Button';
import ErrorMessage from '../ErrorMessage';
import ToggleTheme from '../ToggleTheme';
import { useAuthUser } from '@/hooks/user/useAuthUser';
import LoginErrorBox from './LoginErrorBox';

type Inputs = {
  email: string;
  password: string;
};

const Login = () => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null); // capture error with this state

  const { loginUserMutation } = useAuthUser();

  // handle toggle to show or hide password
  const toggle = () => {
    setOpen(!open);
  };

  const formSchema = Yup.object({
    email: Yup.string().email().required('Email is required !'),
    password: Yup.string()
      .trim()
      .max(16, 'Password must be max 16 characters')
      .required('Password is required !'),
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

  // Function to handle password input change
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const trimmedValue = e.target.value.trim();
    setValue('password', trimmedValue);
    handleClearErrors();
  };

  const handleClearErrors = () => {
    // Clear errors when input value changes
    clearErrors();
  };

  const handleLoginSubmit: SubmitHandler<Inputs> = async (data) => {
    setError(null); // initial on every click
    const loginData = {
      email: data.email,
      password: data.password,
    };

    try {
      const respond = await loginUserMutation.mutateAsync(loginData);
      if (respond.status) {
        router.replace(HOME);
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error_message || err?.message;
      setError(errorMessage);
      // console.log(errorMessage) // Network Error
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center overflow-hidden bg-white dark:bg-neutral-800">
      <div className="relative mx-auto mb-auto mt-32 w-full rounded-md p-6 sm:max-w-lg">
        <ToggleTheme />
        <h2 className="text-center text-3xl font-semibold text-black dark:text-neutral-300">
          Login
        </h2>
        {/* login submit */}
        <form className="mt-3" onSubmit={handleSubmit(handleLoginSubmit)}>
          <div className={`${errors?.email ? 'pb-2' : 'pb-3'}`}>
            <label className="block text-sm font-semibold text-gray-800 dark:text-neutral-300">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              onChange={handleClearErrors}
              // eslint-disable-next-line tailwindcss/migration-from-tailwind-2
              className={`
              ${errors?.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-black focus:border-black focus:ring-black dark:border-neutral-400 dark:focus:border-neutral-500 dark:focus:ring-neutral-400'}
              mt-2.5 block w-full rounded-md border-2  px-4 py-1.5  focus:outline-none focus:ring focus:ring-opacity-40 dark:bg-neutral-700`}
            />
            <ErrorMessage errorName={errors?.email} />
          </div>

          <div className="pb-3">
            <label
              className="block text-sm font-semibold text-gray-800
            dark:text-neutral-300"
            >
              Password
            </label>

            <div className="relative flex cursor-pointer flex-col">
              <input
                {...register('password')}
                type={open === false ? 'password' : 'text'}
                autoComplete="current-password"
                onChange={handlePasswordChange}
                // eslint-disable-next-line tailwindcss/migration-from-tailwind-2
                className={`
                ${errors?.password ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-black focus:border-black focus:ring-black dark:border-neutral-400 dark:focus:border-neutral-500 dark:focus:ring-neutral-400'}
                mt-2.5 block w-full rounded-md border-2 px-4 py-1.5 text-black  focus:outline-none focus:ring focus:ring-opacity-40 dark:bg-neutral-700 dark:text-white`}
              />
              {/* hide/unhide password */}
              <div
                className={`absolute right-3.5 top-2.5 text-2xl ${errors.password ? 'text-red-700' : 'text-black dark:text-white'} `}
              >
                {open === false ? (
                  <VisibilityIcon onClick={toggle} fontSize="small" />
                ) : (
                  <VisibilityOffIcon onClick={toggle} fontSize="small" />
                )}
              </div>

              <ErrorMessage errorName={errors?.password} />
            </div>
          </div>

          <div className="mt-2 flex items-center justify-center">
            {/* <CheckBox //handleClick={setCookies}
              title="Remember me"
            /> */}

            <div>
              <Link
                href={FORGOTPASSWORD}
                className="text-sm text-[#300] decoration-2 hover:underline dark:text-gray-300"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Display Error Message  */}

          {error && <LoginErrorBox message={error} />}

          <div className="pt-5">
            <Button title="Login" type="primary" isPending={loginUserMutation.isPending} />
          </div>
        </form>

        <div className="mt-5">
          <p className="text-center text-sm text-black dark:text-white">
            Not a member ? &nbsp;
            <Link
              href={SIGNUP}
              className="font-semibold leading-6 text-[#300] decoration-2 hover:underline dark:text-gray-300"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
