'use client';

import { useUserData } from '@/hooks/user/useUser';
import Button from '../Button';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import Add from '@mui/icons-material/Add';
import OverviewCard from './OverviewCard';

const Dashboard = () => {
  const { isPending: userLoading, data: currentUser } = useUserData();

  if (!userLoading) {
    console.log(currentUser);
  }

  const firstName = currentUser?.firstName;

  // if is Negative change Balance color

  return (
    <div className="flex-col">
      <div className="bg-gray-200 dark:bg-neutral-700 flex flex-row justify-between -m-4 px-3 pt-4 pb-1.5">
        <p className="mx-2 text-xl"> Hi,{firstName} 👋</p>
        <div className="flex mx-5">
          <Button
            title={
              <div className="flex justify-between text-base dark:text-white">
                <Add className="mr-2" fontSize="medium" /> Add
              </div>
            }
            type="primary"
          />
        </div>
      </div>
      <div className="flex flex-col mt-6 py-1.5">
        <p className="mx-2 text-xl font-semibold">Overview</p>

        <div className="flex justify-between my-6 mx-2">
          {/* Income */}
          <OverviewCard
            title="Income"
            Icon={PaymentsOutlinedIcon}
            iconColor="text-green-500 dark:text-green-600"
            iconSize="large"
            borderColor="border-green-400 dark:border-green-700"
            priceColor="text-green-700 dark:text-green-500"
            priceIcon="Rs."
            price={15_000}
          />

          {/* Expense */}
          <OverviewCard
            borderColor="border-red-400 dark:red-green-700"
            title="Expense"
            Icon={ReceiptLongOutlinedIcon}
            iconColor="text-red-500 dark:text-red-600"
            iconSize="large"
            priceColor="text-red-700 dark:text-red-500"
            priceIcon="Rs."
            price={5_000}
          />
          {/* Balance */}
          <OverviewCard
            borderColor="border-gray-400 dark:border-stone-500"
            title="Balance"
            Icon={AccountBalanceWalletOutlinedIcon}
            iconColor=""
            iconSize="large"
            priceColor=""
            priceIcon="Rs."
            price={10_000}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

//  {/* bg-red-100 */}

//    <div className="flex px-4 py-1.5 border border-solid border-gray-400 dark:border-stone-500 shadow dark:shadow-sm rounded-lg ">
//    {/* text-red-600 */}
//    <AccountBalanceWalletOutlinedIcon className="mr-2" fontSize="large" />

//    <div className="flex flex-col mx-2">
//      <p className="text-sm font-semibold mb-0.5">Balance</p>
//      {/* text-red-800 */}
//      <span className="text-lg tracking-wider">Rs. 14,000.00</span>
//    </div>
//  </div>
