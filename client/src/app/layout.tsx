import './globals.css';
import { Metadata } from 'next';

import ReactQueryProvider from '@/utils/ReactQueryProvider';
import localFont from 'next/font/local';
import { ThemeProvider } from 'next-themes';
import ProgressBarProvider from '@/utils/ProgressBarProvider';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import AntThemeProvider from '@/utils/AntThemeProvider';

export const metadata: Metadata = {
  title: 'BudgetTracker',
  description: 'It an App',
};

const redditMono = localFont({
  src: './fonts/RedditMono-VariableFont_wght.ttf',
});

export default function RootLayout({
  children,
}: Readonly<{
  // eslint-disable-next-line no-undef
  children: React.ReactNode;
}>) {
  return (
    // eslint-disable-next-line tailwindcss/no-custom-classname
    <html lang="en" suppressHydrationWarning className="dark dark:bg-neutral-800">
      {/* <head>
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
      </head> */}

      <body className={redditMono.className}>
        <ProgressBarProvider />
        <ReactQueryProvider>
          {/* <StateProvider initialState={initialState} reducer={reducer}> */}
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AntdRegistry>
              <AntThemeProvider>{children}</AntThemeProvider>
            </AntdRegistry>
          </ThemeProvider>
          {/* </StateProvider> */}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
