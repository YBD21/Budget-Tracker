import { useEffect, useState } from 'react'
// refactor this later
const VerifyOTPErrorBox = ({ message }) => {
  const [isClicked, setIsClicked] = useState(true)
  const [text, setText] = useState({})

  console.log(message)

  useEffect(() => {
    switch (message) {
      case 'Network Error':
        return setText({
          First: 'Network Error !',
          Second: 'Cannot access to the internet.',
        })

      case 'Incorrect Data':
        return setText({
          First: 'Invalid !',
          Second: 'OTP Code.',
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
    return (
      <div
        className="flex flex-col justify-center bg-red-100 border border-red-900 text-red-800 px-2.5 py-3 rounded-md relative mt-4"
        role="alert"
      >
        {/* Display Error Message */}
        <div className="m-auto py-1.5 px-2">
          <strong className="font-bold mr-1.5">{text.First}</strong>
          <span className="sm:inline text-center mr-1.5">{text.Second}</span>
        </div>

        <span className="absolute right-0.5">
          <svg
            className="fill-current h-6 w-6 text-red-700"
            role="button"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            onClick={checkClick}
          >
            {/* <title>Close</title> */}
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
          </svg>
        </span>
      </div>
    )
  } else return null
}

export default VerifyOTPErrorBox
