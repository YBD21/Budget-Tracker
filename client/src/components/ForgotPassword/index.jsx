'use client'

import React, { useState } from 'react'

import FindAccount from './FindAccount'
import VerifyOtp from './VerifyOtp'
import ResetPassword from './ResetPassword'

export const pagesOptions = ['ForgotPassword', 'VerifyOtp', 'ResetPassword']

export const ForgetPassword = () => {
  const [pageName, setPageName] = useState(pagesOptions[1]) // pagesOptions[0]
  const [email, setEmail] = useState('budgettracker@yopmail.com') // remove this later

  const switchPage = (name) => {
    setPageName(name)
  }

  const setEmailfromChild = (Email) => {
    setEmail(Email)
  }

  switch (pageName) {
    case pagesOptions[1]:
      // Verify
      return <VerifyOtp togglePage={switchPage} email={email} />

    case pagesOptions[2]:
      // reset password
      return <ResetPassword email={email} />

    default:
      return (
        <FindAccount
          togglePage={switchPage}
          setEmailToParent={setEmailfromChild}
        />
      )
  }
}
