import './style.css';
import { useThemeStore } from '@/context/Store';
import { message } from 'antd';

type TosterInputs = {
  type: 'success' | 'error' | 'info' | 'warning' | 'loading';
  content: string;
  duration?: number;
};

const showToast = ({ type, content, duration }: TosterInputs) => {
  const themeValue = useThemeStore.getState().theme;

  return message[type]({
    content,
    duration: duration ?? 8,
    className: themeValue === 'dark' ? 'dark-toast' : 'light-toast',
  });
};

export { showToast };
