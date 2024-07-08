'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { useThemeStore } from '@/context/Store';

const ProgressBarProvider = () => {
  const { theme } = useThemeStore();
  console.log(theme);
  return (
    <ProgressBar color="black" height="0.3rem" options={{ showSpinner: false }} shallowRouting />
  );
};

export default ProgressBarProvider;
