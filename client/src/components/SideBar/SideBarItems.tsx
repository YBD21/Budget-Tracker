import { FC } from 'react';
import { Tooltip } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

type SideBarItemsProps = {
  ActiveIcon: SvgIconComponent;
  Icon: SvgIconComponent;
  title: string;
  isActive: boolean;
};

const SideBarItems: FC<SideBarItemsProps> = ({ ActiveIcon, Icon, title, isActive }) => {
  return (
    <Tooltip title={title} followCursor>
      <li
        className={`flex flex-col items-center py-2.5 px-4 cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-xl`}
      >
        {isActive ? <ActiveIcon /> : <Icon />}
        {/* <p className="text-xs">{title}</p> */}
      </li>
    </Tooltip>
  );
};

export default SideBarItems;
