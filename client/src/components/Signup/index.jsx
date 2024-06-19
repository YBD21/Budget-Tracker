'use client'

import { useState } from 'react'

import CreateAccount from './CreateAccount'

const Signup = () => {
  const [togglePage, setTogglePage] = useState(false) // default false

  const switchPage = (status) => {
    setTogglePage(status)
  }

  if (togglePage === true) {
    return <div>verify Email</div>
  }

  return <CreateAccount togglePage={switchPage} />
}

export default Signup
