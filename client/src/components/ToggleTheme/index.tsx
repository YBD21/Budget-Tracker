import { FC, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Tooltip from '@mui/material/Tooltip';

import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { DARK_THEME, LIGHT_THEME } from '@/constants/actionName';

type ToggleThemeProps = {
  style?: string;
  isLarge?: boolean;
};

const ToggleTheme: FC<ToggleThemeProps> = ({ style, isLarge = false }) => {
  const { resolvedTheme, setTheme } = useTheme();

  // Initialize theme state using useState
  const [theme, setThemeState] = useState('');

  // Function to toggle theme
  const toggleTheme = () => {
    const newTheme = theme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    setThemeState(newTheme);
    // Update theme in localStorage
    localStorage.setItem('theme', newTheme);
    // Set theme using next-themes hook
    setTheme(newTheme);
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');

    if (storedTheme) {
      setThemeState(storedTheme);
    } else {
      const newTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? DARK_THEME
        : LIGHT_THEME;
      setThemeState(newTheme);
      // Set theme using next-themes hook
      setTheme(newTheme);
    }
  }, [resolvedTheme, setTheme]);

  return (
    <Tooltip title="Mode">
      <div className={`${style ? style : 'absolute right-4 top-0'} cursor-pointer`}>
        {theme === DARK_THEME ? (
          <DarkModeOutlinedIcon
            suppressHydrationWarning
            onClick={toggleTheme}
            fontSize={isLarge ? 'large' : 'medium'}
          />
        ) : (
          <LightModeOutlinedIcon
            suppressHydrationWarning
            onClick={toggleTheme}
            fontSize={isLarge ? 'large' : 'medium'}
          />
        )}
      </div>
    </Tooltip>
  );
};

export default ToggleTheme;
