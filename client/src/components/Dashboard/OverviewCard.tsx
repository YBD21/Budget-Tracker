'use client';

import { useEffect, useState } from 'react';
import { SvgIconComponent } from '@mui/icons-material';

type OverviewCardProps = {
  Icon: SvgIconComponent;
  title: string;
  iconColor: string;
  borderColor: string;
  iconSize: 'large' | 'medium';
  currencyName: string;
  priceColor: string;
  price: number;
};

const OverviewCard = ({
  Icon,
  title,
  iconColor,
  borderColor,
  currencyName,
  priceColor,
  price,
  iconSize,
}: OverviewCardProps) => {
  const [formattedPrice, setFormattedPrice] = useState('0.00');
  const [displayedPrice, setDisplayedPrice] = useState('0.00');

  useEffect(() => {
    const formatted =
      price?.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) || '0.00';
    setFormattedPrice(formatted);
  }, [price]);

  useEffect(() => {
    let currentPrice = 0;
    const finalPrice = parseFloat(formattedPrice.replace(/,/g, ''));

    const interval = setInterval(() => {
      if (currentPrice < finalPrice) {
        currentPrice += Math.max(1, (finalPrice - currentPrice) / 10);
        setDisplayedPrice(
          currentPrice.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        );
      } else {
        clearInterval(interval);
        setDisplayedPrice(formattedPrice);
      }
    }, 15); // Update interval, you can adjust this for a faster/slower effect

    return () => clearInterval(interval);
  }, [formattedPrice]);

  return (
    <div
      className={`min-w-56 flex px-4 py-1.5 border border-solid ${borderColor} shadow dark:shadow-sm rounded-lg`}
    >
      <Icon className={`mr-2 ${iconColor}`} fontSize={iconSize} />

      <div className="flex flex-col mx-2">
        <p className="text-sm font-semibold mb-0.5">{title}</p>
        <span
          className={`transition-transform transform-gpu ease-in-out duration-700 text-lg tracking-wider ${priceColor} inline-block sm:text-base`}
          key={displayedPrice} // This forces a re-render to apply the transition
        >
          {currencyName} {displayedPrice}
        </span>
      </div>
    </div>
  );
};

export default OverviewCard;
