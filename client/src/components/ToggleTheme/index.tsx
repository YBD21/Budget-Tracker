import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'

import darkModeIcon from '@/assets/darkmode.svg'
import lightModeIcon from '@/assets/lightmode.svg'
import { DARK_THEME, LIGHT_THEME } from '@/constants/actionName'

function ToggleTheme() {
  const { resolvedTheme, setTheme } = useTheme()

  // Initialize theme state using useState
  const [theme, setThemeState] = useState('')

  // Function to toggle theme
  const toggleTheme = () => {
    const newTheme = theme === DARK_THEME ? LIGHT_THEME : DARK_THEME
    setThemeState(newTheme)
    // Update theme in localStorage
    localStorage.setItem('theme', newTheme)
    // Set theme using next-themes hook
    setTheme(newTheme)
  }

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')

    if (storedTheme) {
      setThemeState(storedTheme)
    } else {
      const newTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? DARK_THEME
        : LIGHT_THEME
      setThemeState(newTheme)
      // Set theme using next-themes hook
      setTheme(newTheme)
    }
  }, [resolvedTheme, setTheme])

  return (
    <div className="absolute right-4 top-0 cursor-pointer">
      {theme === DARK_THEME ? (
        <Image
          suppressHydrationWarning
          src={darkModeIcon}
          alt="Dark Mode"
          width={24}
          height={24}
          onClick={toggleTheme}
        />
      ) : (
        <Image
          suppressHydrationWarning
          src={lightModeIcon}
          alt="Light Mode"
          width={24}
          height={24}
          onClick={toggleTheme}
        />
      )}
    </div>
  )
}

export default ToggleTheme
