/* eslint-disable tailwindcss/migration-from-tailwind-2 */
'use client';

import { FC, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import ToggleTheme from '../ToggleTheme';
import ErrorMessage from '../ErrorMessage';
import VerifyOTPErrorBox from '../ForgotPassword/VerifyOTPErrorBox';
import Button from '../Button';
import { useAuthUser } from '@/hooks/user/useAuthUser';
import VerifyEmailMessageBox from './VerifyEmailMessageBox';
import { LOGIN } from '@/constants/Routes';
import { UserInfo } from '.';

type VerifyEmailProps = {
  togglePage: (status: boolean) => void;
  userInfo: UserInfo;
};

type Inputs = {
  otp: string;
};

type Message = string | null;

const VerifyEmail: FC<VerifyEmailProps> = ({ togglePage, userInfo }) => {
  const router = useRouter();

  const { sendOtpEmailMutation, verifyOtpMutation, createAccountMutation } = useAuthUser();

  const [message, setMessage] = useState<Message>(null);
  const [error, setError] = useState(null); // capture error with this state
  const [encOtp, setEncOtp] = useState(null);

  const MAX = 6;

  const formSchema = Yup.object({
    otp: Yup.string()
      .required('Verification code is required !')
      .test(
        'otp',
        `Verification code must be ${MAX} characters!`,
        (val) => !Number.isNaN(val) && val.toString().length === MAX
      ),
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

  const cancelVerify = (e: any) => {
    e.preventDefault(); // prevent page refresh
    togglePage(false);
  };

  const redirectToLogin = () => {
    router.replace(LOGIN);
  };
  // display messege that your account has been created

  const sendEmail = useCallback(async () => {
    const userData = {
      email: userInfo?.email,
    };
    try {
      const data = await sendOtpEmailMutation.mutateAsync(userData);
      setEncOtp(data);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error_message || err?.message;
      setError(errorMessage);
    }
  }, [sendOtpEmailMutation, userInfo?.email]);

  const reSendEmail = (e: any) => {
    e.preventDefault(); // prevent page refresh
    setError(null); // clear previous error
    sendEmail();
  };

  const handleSignUpSubmit = async () => {
    setMessage(null); // clear previous error
    try {
      const response = await createAccountMutation.mutateAsync(userInfo);
      if (response.status === true) {
        setMessage('Account Created');
        // wait timer of 2 sec and redirect
        setTimeout(redirectToLogin, 2000);
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error_message || err?.message;
      setMessage(errorMessage);
    }
  };

  const handleVerifySubmit: SubmitHandler<Inputs> = async (data) => {
    setError(null); // clear previous error

    const userData = {
      otp: data.otp, // string
      hash: encOtp,
    };

    try {
      const response = await verifyOtpMutation.mutateAsync(userData);
      if (response.status === true) {
        await handleSignUpSubmit();
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error_message || err?.message;
      setError(errorMessage);
    }
  };

  useEffect(() => {
    sendEmail();
  }, [sendEmail]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="relative mb-auto mt-14 w-full rounded-md  p-6 sm:max-w-lg">
        <ToggleTheme />
        <h2 className="mb-4 text-center text-3xl font-semibold text-black dark:text-neutral-300">
          Verify your email !
        </h2>
        <p className="py-5 text-center font-semibold text-gray-700 dark:text-neutral-300">
          Verification code was sent to{' '}
          <span className="font-medium text-[#300] dark:text-white">{userInfo?.email}</span>
        </p>
        {/* verify code */}
        <form className="mt-6">
          {/* Code Box */}
          <div className="mb-2">
            <label className="block text-sm font-semibold text-gray-800 dark:text-neutral-300">
              Verification code
            </label>
            <div className="flex cursor-pointer flex-row">
              <input
                {...register('otp')}
                type="number"
                onChange={handleClearErrors}
                className={`
            ${errors?.otp ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-black focus:border-black focus:ring-black dark:border-neutral-400 dark:focus:border-neutral-500 dark:focus:ring-neutral-400'}
            mt-2.5 block w-full rounded-md border-2  px-4 py-1.5  text-center placeholder:text-sm focus:outline-none focus:ring focus:ring-opacity-40 dark:bg-neutral-700`}
              />
            </div>
            {/* Error Message */}
            <ErrorMessage errorName={errors?.otp} />
          </div>

          <div
            className={`flex flex-row  px-2.5 py-2  ${sendOtpEmailMutation.isPending ? 'justify-end' : 'justify-between'}`}
          >
            {/* Resend will only apper when verify code is generated in backend */}

            {!sendOtpEmailMutation.isPending && (
              <button
                className={`cursor-pointer text-sm font-semibold text-blue-600 decoration-blue-600 decoration-2 hover:underline`}
                onClick={reSendEmail}
              >
                Resend Code
              </button>
            )}

            <button
              className="cursor-pointer text-sm font-medium text-black decoration-2  hover:underline dark:text-gray-300"
              onClick={cancelVerify}
            >
              Go Back
            </button>
          </div>

          {/* Display Error Message Box  */}
          {error && <VerifyOTPErrorBox message={error} />}

          {/* Message Box */}
          {message && <VerifyEmailMessageBox message={message} />}

          {/* Verify */}
          <div className="mt-4 min-w-max">
            <Button
              title={'Verify'}
              type="primary"
              isDisable={sendOtpEmailMutation.isPending}
              isPending={verifyOtpMutation.isPending || createAccountMutation.isPending}
              handleClick={handleSubmit(handleVerifySubmit)}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
