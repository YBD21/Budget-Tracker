import { usePathname } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

const Sidebar = () => {
  const pathname = usePathname();
  //   const isItemActive = pathname?.startsWith(item?.url)
  return (
    <nav className="w-16 px-2 shadow bg-gray-50 dark:bg-neutral-800 h-[93svh]">
      <ul className="space-y-2 list-none">
        <li className="flex flex-col items-center py-2 px-4 cursor-pointer">
          <HomeOutlinedIcon fontSize="large" />
          {/* <HomeIcon fontSize="large" /> */}
          <p className="text-xs">Home</p>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
