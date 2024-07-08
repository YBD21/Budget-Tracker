'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const ProgressBarProvider = () => {
  return (
    <ProgressBar height="0.3rem" color="#3b82f6" options={{ showSpinner: false }} shallowRouting />
  );
};

export default ProgressBarProvider;
