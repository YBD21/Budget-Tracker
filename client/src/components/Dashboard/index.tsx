'use client';

import { useUserData } from '@/hooks/user/useUser';
import Button from '../Button';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import Add from '@mui/icons-material/Add';
import OverviewCard from './OverviewCard';
import SearchBar from '../SearchBar';
import DataTable from '../DataTable';

const Dashboard = () => {
  const { isPending: userLoading, data: currentUser } = useUserData();

  if (!userLoading) {
    console.log(currentUser);
  }

  const firstName = currentUser?.firstName;
  const income = currentUser?.totalIncome;
  const expense = currentUser?.totalExpense;
  const balance = currentUser?.totalBalance;

  // if is Negative change Balance color

  return (
    <div className="flex-col">
      <div className="flex flex-row justify-between -m-4 px-3 pt-4 pb-1.5">
        <p className="mx-2 text-xl"> Hi,{firstName} 👋</p>
        {/* <div className="flex mx-5">
          <Button
            title={
              <div className="flex justify-between text-base dark:text-white">
                <Add className="mr-2" fontSize="medium" /> Add
              </div>
            }
            type="primary"
          />
        </div> */}
      </div>
      <div className="flex flex-col mt-6 py-1.5 lg:mx-auto lg:max-w-screen-lg">
        {/* <p className="m-1.5 text-xl font-semibold text-center">Overview</p> */}

        <div className="flex justify-between my-8 mx-2 lg:gap-24">
          {/* Income */}
          <OverviewCard
            title="Income"
            Icon={PaymentsOutlinedIcon}
            iconColor="text-green-500 dark:text-green-600"
            iconSize="large"
            borderColor="border-green-400 dark:border-green-700"
            priceColor="text-green-700 dark:text-green-500"
            currencyName="Rs."
            price={income}
          />

          {/* Expense */}
          <OverviewCard
            borderColor="border-red-400 dark:red-green-700"
            title="Expense"
            Icon={ReceiptLongOutlinedIcon}
            iconColor="text-red-500 dark:text-red-600"
            iconSize="large"
            priceColor="text-red-700 dark:text-red-500"
            currencyName="Rs."
            price={expense}
          />
          {/* Balance */}
          <OverviewCard
            borderColor="border-gray-400 dark:border-stone-500"
            title="Balance"
            Icon={AccountBalanceWalletOutlinedIcon}
            iconColor=""
            iconSize="large"
            priceColor=""
            currencyName="Rs."
            price={balance}
          />
        </div>
        <SearchBar />
        <DataTable />
      </div>
    </div>
  );
};

export default Dashboard;
