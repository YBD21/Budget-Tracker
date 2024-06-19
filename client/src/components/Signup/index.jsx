'use client'

import { useState } from 'react'

import CreateAccount from './CreateAccount'
import VerifyEmail from './VerifyEmail'

const Signup = () => {
  const [togglePage, setTogglePage] = useState(true) // default false

  const switchPage = (status) => {
    setTogglePage(status)
  }

  if (togglePage === true) {
    return <VerifyEmail togglePage={switchPage} email={''} />
  }

  return <CreateAccount togglePage={switchPage} />
}

export default Signup
