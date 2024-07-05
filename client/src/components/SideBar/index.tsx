import { usePathname } from 'next/navigation';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';

const Sidebar = () => {
  const pathname = usePathname();
  //   const isItemActive = pathname?.startsWith(item?.url)

  // Dashboard,History,Customization

  // At the end Logout
  return (
    <nav className="w-16 px-2 shadow-xl bg-gray-50 dark:bg-neutral-800 h-[93svh] border-r border-solid border-gray-200 dark:border-stone-900">
      <ul className="space-y-2 list-none mt-2">
        <li className="flex flex-col items-center py-2 px-4 cursor-pointer">
          <DashboardOutlinedIcon fontSize="large" />
          {/* <HomeIcon fontSize="large" /> */}
          {/* <p className="text-xs">Home</p> */}
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
