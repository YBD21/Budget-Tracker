'use client';

import { useState } from 'react';

import CreateAccount from './CreateAccount';
import VerifyEmail from './VerifyEmail';

export type UserInfo = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
} | null;

const Signup = () => {
  const [togglePage, setTogglePage] = useState(false); // default false
  const [userData, setUserData] = useState<UserInfo>(null);

  const switchPage = (status: boolean) => {
    setTogglePage(status);
  };

  const setUserInfo = (data: UserInfo) => {
    setUserData(data);
  };

  if (togglePage === true) {
    return <VerifyEmail togglePage={switchPage} userInfo={userData} />;
  }

  return <CreateAccount togglePage={switchPage} setUserInfo={setUserInfo} />;
};

export default Signup;
