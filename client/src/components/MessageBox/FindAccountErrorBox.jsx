import { useEffect, useState } from 'react'
import MessageBox from '.'
// refactor this later
const FindAccountErrorBox = ({ message }) => {
  const [isClicked, setIsClicked] = useState(true)
  const [text, setText] = useState({})

  useEffect(() => {
    switch (message) {
      case 'Network Error':
        return setText({
          First: 'Network Error !',
          Second: 'Cannot access to the internet.',
        })

      case 'Incorrect Data':
        return setText({
          First: 'Sorry !',
          Second: 'Account not found.',
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

      default:
        return setText({
          First: 'Holy smokes !',
          Second: 'Something seriously bad happened.',
        })
    }
  }, [isClicked])

  const checkClick = () => {
    setIsClicked(!isClicked)
    // console.log("Someting is happening ?");
  }

  if (isClicked) {
    return <MessageBox text={text} checkClick={checkClick} />
  } else return null
}

export default FindAccountErrorBox
