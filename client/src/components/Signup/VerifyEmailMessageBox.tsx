import { useEffect, useState } from 'react'
import MessageBox from '../MessageBox'

const VerifyEmailMessageBox = ({ message }) => {
  const [isClicked, setIsClicked] = useState(true) // default true
  const [text, setText] = useState({}) // default {}
  const [status, setStatus] = useState(true) // default true

  useEffect(() => {
    switch (message) {
      case 'Network Error':
        return setText({
          First: 'Network Error !',
          Second: 'Cannot access to the internet.',
        })

      case 'Incorrect Data':
        return setText({
          First: 'Sorry',
          Second: 'Account Already Exists!',
        })

      case 'Disable Account':
        return setText({
          First: 'Sorry !',
          Second: 'Your account has been disable.',
        })

      case 'Too Many Requests':
        return setText({
          First: 'Too many login attempts',
          Second: ',please try again later !',
        })

      case 'Account Created':
        return (
          setStatus(false),
          setText({
            First: 'Great !',
            Second: 'Your account has been created.',
          })
        )

      default:
        return setText({
          First: 'Holy smokes !',
          Second: 'Something seriously bad happened.',
        })
    }
  }, [isClicked])

  const checkClick = () => {
    setIsClicked(!isClicked)
  }

  if (isClicked) {
    return <MessageBox text={text} checkClick={checkClick} isError={status} />
  } else return null
}

export default VerifyEmailMessageBox
