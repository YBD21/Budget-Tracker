import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SettingsIcon from '@mui/icons-material/Settings';
import { deleteAllCookies } from '@/services/userServer';

type userProps = {
  openStatus: boolean;
  onChange: (arg0: boolean) => void;
};

const UserDropDown = ({ openStatus, onChange }: userProps) => {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: { target: any }) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onChange(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

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
        className={`absolute transform origin-top-left -translate-x-1/2 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${
          openStatus ? 'block' : 'hidden'
        }`}
      >
        {/* <div className="px-4 py-3 border-b border-gray-600"><Profile /></div>  */}
        <ul className="divide-y divide-gray-600 p-2">
          {/* Setting */}
          {/* <li className="flex items-center px-1.5 py-2.5  text-gray-700  hover:bg-gray-100 rounded-md ">
            <Link href="/Setting" className="w-full font-medium text-base hover:text-black">
              <SettingsIcon fontSize="medium" className="ml-3 mr-10" />
              Setting
            </Link>
          </li> */}
          {/* LogOut */}
          <li
            className="flex items-center px-1.5 py-2.5 text-gray-700 hover:bg-gray-100 hover:text-red-800 rounded-md"
            onClick={logOut}
          >
            <ExitToAppIcon fontSize="medium" className="ml-3 mr-10" />
            <span className="w-full font-medium text-base  hover:text-red-800">Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserDropDown;
