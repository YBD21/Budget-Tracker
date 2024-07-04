'use client';

import ToggleTheme from '../ToggleTheme';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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
      {/* max-w-screen-sm */}
      <ul className="flex w-1/2 justify-end mx-4">
        <li className="flex my-auto mx-4">
          <ToggleTheme style={'flex'} height={34} width={34} />
        </li>
        <li className="my-auto mx-4">
          <NotificationsOutlinedIcon fontSize="large" className="cursor-pointer" />
        </li>
        <li className="my-auto mx-4">
          <AccountCircleIcon fontSize="large" className="cursor-pointer" />
        </li>
        {/* Profile  */}
      </ul>
    </header>
  );
};

export default NavBar;
