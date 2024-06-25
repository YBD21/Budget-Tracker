import { useEffect, useState } from 'react';
import MessageBox from '@/components/MessageBox';

// refactor this later
const LoginErrorBox = ({ message }: any) => {
  const [isClicked, setIsClicked] = useState(true);
  const [text, setText] = useState({});

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

      default:
        return setText({
          First: 'Holy smokes !',
          Second: 'Something seriously bad happened.',
        });
    }
  }, [isClicked, message]);

  const checkClick = () => {
    setIsClicked(!isClicked);
    // console.log("Someting is happening ?");
  };

  if (isClicked) {
    return <MessageBox text={text} checkClick={checkClick} />;
  } else return null;
};

export default LoginErrorBox;
