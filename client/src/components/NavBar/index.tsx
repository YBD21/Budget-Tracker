'use client';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import MenuIcon from '@mui/icons-material/Menu';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ToggleTheme from '../ToggleTheme';

const NavBar = () => {
  return (
    <div className="overflow-visible">
      <header className="sticky top-0 z-30 bg-gray-50 dark:bg-neutral-800 flex flex-row w-full drop-shadow-lg h-16">
        {/* Title Name */}
        <div className="flex w-1/2">
          <div className="flex items-center mx-3.5">
            <IconButton size="small" edge="start" color="inherit" aria-label="menu">
              <MenuIcon className="transition duration-300 ease-in-out dark:text-white dark:hover:text-white dark:hover:drop-shadow-[0_0_10px_rgba(255,255,255,1)] hover:text-black hover:drop-shadow-[0_0_10px_rgba(0,0,0,1)]" />
            </IconButton>

            <p className="mx-4 text-base font-medium">Budget Tracker</p>
          </div>
        </div>
        {/* max-w-screen-sm */}
        <ul className="flex w-1/2 justify-end mx-4">
          <li className="flex my-auto mx-4">
            <ToggleTheme style={'flex'} />
          </li>

          <li className="my-auto mx-4">
            <Tooltip title="Notification">
              <NotificationsOutlinedIcon className="cursor-pointer" />
            </Tooltip>
          </li>

          <li className="my-auto mx-4">
            <AccountCircleIcon fontSize="large" className="cursor-pointer" />
          </li>
          {/* Profile  */}
        </ul>
      </header>
    </div>
  );
};

export default NavBar;
