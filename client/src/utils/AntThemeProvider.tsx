'use client';

import { ReactNode } from 'react';
import { ConfigProvider, theme } from 'antd';
import { useThemeStore } from '@/context/Store';

const AntThemeProvider = ({ children }: { children: ReactNode }) => {
  const { theme: themeValue } = useThemeStore();

  return (
    <ConfigProvider
      theme={{
        algorithm: themeValue === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AntThemeProvider;
