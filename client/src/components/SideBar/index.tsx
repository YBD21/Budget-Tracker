import { usePathname } from 'next/navigation';

import DashboardIcon from '@mui/icons-material/Dashboard';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import { SvgIconComponent } from '@mui/icons-material';
import SideBarItems from './SideBarItems';
import { DASHBOARD } from '@/constants/Routes';

type SidebarItem = {
  url: string;
  title: string;
  ActiveIcon: SvgIconComponent;
  Icon: SvgIconComponent;
};

const Sidebar = () => {
  const pathname = usePathname();

  const itemList: SidebarItem[] = [
    {
      url: DASHBOARD,
      title: 'Dashboard',
      Icon: DashboardOutlinedIcon,
      ActiveIcon: DashboardIcon,
    },
  ];

  // Dashboard,History,Customization

  // At the end Logout
  return (
    <nav className="w-20 px-2 shadow-xl bg-gray-50 dark:bg-neutral-800 h-[93svh] border-r border-solid border-gray-200 dark:border-stone-900">
      <ul className="space-y-2 list-none mt-2">
        {itemList.map((item, index) => (
          <SideBarItems
            key={index}
            Icon={item.Icon}
            ActiveIcon={item.ActiveIcon}
            title={item.title}
            isActive={pathname?.startsWith(item.url) || false}
          />
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
