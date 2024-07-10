'use client';

import { SvgIconComponent } from '@mui/icons-material';

type OverviewCardProps = {
  Icon: SvgIconComponent;
  title: string;
  iconColor: string;
  borderColor: string;
  iconSize: 'large' | 'medium';
  priceIcon: 'Rs.' | string;
  priceColor: string;
  price: Number;
};

const OverviewCard = ({
  Icon,
  title,
  iconColor,
  borderColor,
  priceIcon,
  priceColor,
  price,
  iconSize,
}: OverviewCardProps) => {
  const formattedPrice = price?.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div
      className={`min-w-56 flex px-4 py-1.5 border border-solid ${borderColor} shadow dark:shadow-sm rounded-lg`}
    >
      <Icon className={`mr-2 ${iconColor}`} fontSize={iconSize} />

      <div className="flex flex-col mx-2">
        <p className="text-sm font-semibold mb-0.5">{title}</p>
        <span className={`text-lg tracking-wider ${priceColor}`}>
          {priceIcon} {formattedPrice}
        </span>
      </div>
    </div>
  );
};

export default OverviewCard;
