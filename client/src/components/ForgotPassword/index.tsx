'use client';

import { useState } from 'react';

import FindAccount from './FindAccount';
import VerifyOtp from './VerifyOtp';
import ResetPassword from './ResetPassword';

export const pagesOptions = ['ForgotPassword', 'VerifyOtp', 'ResetPassword'];

export const ForgetPassword = () => {
  const [pageName, setPageName] = useState(pagesOptions[0]); // default pagesOptions[0]
  const [email, setEmail] = useState<string>(''); // default ''

  const switchPage = (name: string) => {
    setPageName(name);
  };

  const setEmailfromChild = (emailName: string) => {
    setEmail(emailName);
  };

  switch (pageName) {
    case pagesOptions[1]:
      // Verify
      return <VerifyOtp togglePage={switchPage} email={email} />;

    case pagesOptions[2]:
      // reset password
      return <ResetPassword email={email} />;

    default:
      return <FindAccount togglePage={switchPage} setEmailToParent={setEmailfromChild} />;
  }
};
