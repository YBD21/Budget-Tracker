import { useEffect, useState } from 'react';
import MessageBox from '../MessageBox';

// refactor this later
const ResetPasswordMessageBox = ({ message }: any) => {
  const [isClicked, setIsClicked] = useState(true); // default true
  const [text, setText] = useState({}); // default {}
  const [status, setStatus] = useState(true); // default true

  useEffect(() => {
    switch (message) {
      case 'Network Error':
        return setText({
          First: 'Network Error !',
          Second: 'Cannot access to the internet.',
        });

      case 'Incorrect Data':
        return setText({
          First: 'Incorrect ',
          Second: 'Email Or Password !',
        });

      case 'Disable Account':
        return setText({
          First: 'Sorry !',
          Second: 'Your account has been disable.',
        });

      case 'Too Many Requests':
        return setText({
          First: 'Too many login attempts',
          Second: ',please try again later !',
        });

      case 'ResetPassword':
        return (
          setStatus(false),
          setText({
            First: 'Great !',
            Second: 'Your password has been reset.',
          })
        );

      default:
        return setText({
          First: 'Holy smokes !',
          Second: 'Something seriously bad happened.',
        });
    }
  }, [isClicked, message]);

  const checkClick = () => {
    setIsClicked(!isClicked);
  };

  if (isClicked) {
    return <MessageBox text={text} checkClick={checkClick} isError={status} />;
  } else return null;
};

export default ResetPasswordMessageBox;
