import { useRouter } from 'next-nprogress-bar';
import { Tooltip } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

type SideBarItemsProps = {
  ActiveIcon: SvgIconComponent;
  Icon: SvgIconComponent;
  title: string;
  isActive: boolean;
  url: string;
};

const SideBarItems = ({ ActiveIcon, Icon, title, isActive, url }: SideBarItemsProps) => {
  const router = useRouter();

  const redirect = () => {
    router.push(url);
  };

  return (
    <Tooltip title={title} followCursor>
      <li
        className={`flex flex-col items-center my-2.5 py-2.5 px-4 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl ${isActive && 'bg-neutral-300 dark:bg-neutral-600'}`}
        onClick={redirect}
      >
        {isActive ? <ActiveIcon /> : <Icon />}
        {/* <p className="text-xs">{title}</p> */}
      </li>
    </Tooltip>
  );
};

export default SideBarItems;
