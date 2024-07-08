'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const ProgressBarProvider = () => {
  return (
    <ProgressBar color="#736e6e" height="0.3rem" options={{ showSpinner: false }} shallowRouting />
  );
};

export default ProgressBarProvider;
