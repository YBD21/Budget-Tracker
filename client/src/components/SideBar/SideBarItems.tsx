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
    <li className={`flex flex-col items-center py-2 px-4 cursor-pointer`}>
      <Tooltip title={title}>{isActive ? <ActiveIcon /> : <Icon />}</Tooltip>
      {/* <p className="text-xs">{title}</p> */}
    </li>
  );
};

export default SideBarItems;
