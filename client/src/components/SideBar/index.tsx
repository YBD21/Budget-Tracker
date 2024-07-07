import { usePathname } from 'next/navigation';

import DashboardIcon from '@mui/icons-material/Dashboard';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import AutoFixNormalOutlinedIcon from '@mui/icons-material/AutoFixNormalOutlined';
import { SvgIconComponent } from '@mui/icons-material';
import SideBarItems from './SideBarItems';
import { CUSTOMIZATION, DASHBOARD, HISTORY } from '@/constants/Routes';

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
    {
      url: HISTORY,
      title: 'History',
      Icon: WatchLaterOutlinedIcon,
      ActiveIcon: WatchLaterIcon,
    },
    {
      url: CUSTOMIZATION,
      title: 'Customization',
      Icon: AutoFixNormalOutlinedIcon,
      ActiveIcon: AutoFixNormalIcon,
    },
  ];

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
            url={item.url}
          />
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
