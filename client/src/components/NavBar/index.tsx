'use client';

import ToggleTheme from '../ToggleTheme';

const NavBar = () => {
  return (
    <header className="sticky top-0 z-30 bg-gray-50 dark:bg-neutral-800 flex flex-row w-full drop-shadow-lg h-16">
      <ToggleTheme />
      <div className="flex w-1/2 mx-2">
        <div className="flex items-center">
          <strong className="mx-5"> Budget Tracker</strong>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
