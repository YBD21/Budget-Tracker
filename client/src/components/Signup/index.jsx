'use client'

import { useState } from 'react'

import CreateAccount from './CreateAccount'
import VerifyEmail from './VerifyEmail'

const Signup = () => {
  const [togglePage, setTogglePage] = useState(false) // default false
  const [userData, setUserData] = useState(null)

  const switchPage = (status) => {
    setTogglePage(status)
  }

  const setUserInfo = (data) => {
    setUserData(data)
  }

  if (togglePage === true) {
    return <VerifyEmail togglePage={switchPage} userInfo={userData} />
  }

  return <CreateAccount togglePage={switchPage} setUserInfo={setUserInfo} />
}

export default Signup
