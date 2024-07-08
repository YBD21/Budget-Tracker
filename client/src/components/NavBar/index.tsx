'use client';
import { useState, ReactNode } from 'react';
import Link from 'next/link';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Image from 'next/image';

import MenuIcon from '@mui/icons-material/Menu';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ToggleTheme from '../ToggleTheme';
import Logo from '@/assets/logo.svg';
import Sidebar from '../SideBar';
import { DASHBOARD } from '@/constants/Routes';

type NavProps = { children: ReactNode };

const NavBar = ({ children }: NavProps) => {
  const [isExpand, setIsExpand] = useState(false);

  const toggleExpand = (status: boolean) => {
    setIsExpand(!status);
  };

  return (
    <div className="overflow-visible h-svh">
      <header className="sticky top-0 z-30 bg-gray-50 dark:bg-neutral-800 flex flex-row w-full drop-shadow-lg h-16">
        {/* Title Name */}
        <div className="flex w-1/2">
          <div className="flex items-center ml-6">
            <IconButton
              className="hover:bg-neutral-200 dark:hover:bg-neutral-700"
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => {
                toggleExpand(isExpand);
              }}
            >
              <MenuIcon className="dark:text-white dark:hover:text-white" />
            </IconButton>

            <Link href={DASHBOARD} className="mx-3.5 flex justify-between gap-1">
              <Image
                suppressHydrationWarning
                src={Logo}
                alt="Logo"
                width={24}
                height={24}
                className="rounded-md border-2 border-solid dark:border-white"
              />

              <p className="text-base font-medium">BudgetTracker</p>
            </Link>
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

          {/* Profile  */}
          <li className="my-auto mx-4">
            <AccountCircleIcon fontSize="large" className="cursor-pointer" />
          </li>
        </ul>
      </header>
      <main className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar isExpand={isExpand} />
        {/* Main content */}
        <div className="w-full px-8 py-2.5">{children}</div>
      </main>
    </div>
  );
};

export default NavBar;
