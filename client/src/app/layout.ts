import './globals.css'
import { Metadata } from 'next'
import ReactQueryProvider from '@/utils/ReactQueryProvider'
import localFont from 'next/font/local'
import { ThemeProvider } from '../components/ToggleTheme/providers.jsx'


export const metadata : Metadata= {
  title: 'Budget Tracker',
  description: 'It an App',
}

const redditMono = localFont({
  src: './fonts/RedditMono-VariableFont_wght.ttf',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  return (
    <html lang="en" suppressHydrationWarning className="dark dark:bg-neutral-800">
      {/* <head>
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
      </head> */}

      <body className={redditMono.className}>
        <ReactQueryProvider>
          {/* <StateProvider initialState={initialState} reducer={reducer}> */}
          <ThemeProvider
            suppressHydrationWarning
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            {children}
          </ThemeProvider>
          {/* </StateProvider> */}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
