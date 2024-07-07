import Link from 'next/link';
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
  return (
    <Tooltip title={title} followCursor>
      <Link href={url}>
        <li
          className={`flex flex-col items-center py-2.5 px-4 cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-xl`}
        >
          {isActive ? <ActiveIcon /> : <Icon />}
          {/* <p className="text-xs">{title}</p> */}
        </li>
      </Link>
    </Tooltip>
  );
};

export default SideBarItems;
