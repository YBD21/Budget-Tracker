import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MutableRefObject, useEffect, useRef } from 'react';

import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SettingsIcon from '@mui/icons-material/Settings';
import { deleteAllCookies } from '@/services/userServer';
import { SETTING } from '@/constants/Routes';

type userProps = {
  openStatus: boolean;
  onChange: (arg0: boolean) => void;
  parentRef: MutableRefObject<HTMLLIElement | null>;
};

const UserDropDown = ({ openStatus, onChange, parentRef }: userProps) => {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isClickOutsideDropdown =
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node);
      const isClickOutsideParent =
        parentRef.current && !parentRef.current.contains(event.target as Node);

      if (isClickOutsideDropdown && isClickOutsideParent) {
        onChange(false); // Close dropdown if clicked outside both
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef, parentRef]);

  const logOut = async () => {
    // add api for logout
    await deleteAllCookies();
    router.refresh(); // refresh page
  };

  return (
    <div
      className="relative top-16 right-16 inline-block text-left z-20 cursor-pointer translate-y-0"
      ref={dropdownRef}
    >
      <div
        className={`absolute transform origin-top-left -translate-x-1/2 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-neutral-800 ring-1 ring-black ring-opacity-5  dark:text-gray-300 text-gray-700 ${
          openStatus ? 'block' : 'hidden'
        }`}
      >
        {/* <div className="px-4 py-3 border-b border-gray-600"><Profile /></div>  */}
        <ul className="divide-y divide-gray-600 p-2">
          {/* Setting */}
          {/* <li className="flex items-center px-1.5 py-2.5 dark:hover:bg-neutral-700 hover:bg-gray-100 rounded-md hover:text-black dark:hover:text-white">
            <Link href={SETTING} className="w-full font-medium text-base">
              <SettingsIcon fontSize="medium" className="ml-3 mr-10" />
              Setting
            </Link>
          </li> */}
          {/* LogOut */}
          <li
            className="flex items-center px-1.5 py-2.5 hover:bg-gray-100 dark:hover:bg-neutral-700 dark:hover:text-red-600 hover:text-red-800 rounded-md"
            onClick={logOut}
          >
            <ExitToAppIcon fontSize="medium" className="ml-3 mr-10" />
            <span className="w-full font-medium text-base  hover:text-red-800 dark:hover:text-red-600">
              Logout
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserDropDown;
