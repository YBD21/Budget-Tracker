'use client';

import ToggleTheme from '../ToggleTheme';
import MenuIcon from '@mui/icons-material/Menu';

const NavBar = () => {
  return (
    <header className="sticky top-0 z-30 bg-gray-50 dark:bg-neutral-800 flex flex-row w-full drop-shadow-lg h-16">
      {/* Title Name */}
      <div className="flex w-1/2">
        <div className="flex items-center mx-3.5">
          <MenuIcon />
          <p className="mx-4 text-base font-medium">Budget Tracker</p>
        </div>
      </div>
      <ul className="flex justify-between w-full max-w-screen-lg mx-auto lg:max-w-full">
        <ToggleTheme style={''} height={32} width={32} />
        {/* Toggle Theme */}
        {/* Notification */}
        {/* Profile  */}
      </ul>
    </header>
  );
};

export default NavBar;
