import { useRouter } from 'next-nprogress-bar';
import { Tooltip } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

type SideBarItemsProps = {
  ActiveIcon: SvgIconComponent;
  Icon: SvgIconComponent;
  title: string;
  isActive: boolean;
  url: string;
  isExpand: boolean;
};

const SideBarItems = ({ ActiveIcon, Icon, title, isActive, url, isExpand }: SideBarItemsProps) => {
  const router = useRouter();

  const redirect = () => {
    router.push(url);
  };

  // if title is null tooltip is not shown

  if (!isExpand) {
    return (
      <Tooltip title={title} followCursor>
        <li
          className={`flex flex-col items-center my-2.5 py-2.5 px-4 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl ${isActive && 'bg-neutral-300 dark:bg-neutral-600'} shadow border border-solid border-gray-100 dark:border-stone-700 dark:shadow-lg`}
          onClick={redirect}
        >
          {isActive ? <ActiveIcon /> : <Icon />}
        </li>
      </Tooltip>
    );
  }

  return (
    <li
      className={`flex justify-between items-center my-2.5 py-2.5 px-4 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl ${isActive && 'bg-neutral-300 dark:bg-neutral-600'} shadow border border-solid border-gray-100 dark:border-stone-700 dark:shadow-lg`}
      onClick={redirect}
    >
      <div className="flex items-center space-x-5">{isActive ? <ActiveIcon /> : <Icon />}</div>
      <p className={`text-xs flex-grow text-center ${isActive ? 'font-semibold' : 'font-normal'}`}>
        {title}
      </p>
    </li>
  );
};

export default SideBarItems;
