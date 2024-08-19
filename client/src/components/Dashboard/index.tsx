'use client';

import { useBudgetOverview, useUserName } from '@/hooks/user/useUser';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import OverviewCard from './OverviewCard';
import SearchBar from '../SearchBar';
import DataTable from '../DataTable';
import AddBudget from '../AddBudget';

const Dashboard = () => {
  const { data: userData } = useUserName();
  const { data: budgetData } = useBudgetOverview();

  const firstName = userData?.firstName;
  const income = budgetData?.totalIncome;
  const expense = budgetData?.totalExpense;
  const balance = budgetData?.totalBalance;

  // if is Negative change Balance color

  return (
    <div className="flex-col">
      <div className="flex flex-row justify-between -m-4 px-3 pt-4 pb-1.5">
        <p className="mx-2 text-xl"> Hi,{firstName} 👋</p>
      </div>
      <div className="flex flex-col mt-6 py-1.5 lg:mx-auto lg:max-w-screen-lg">
        <p className="m-1.5 text-xl font-semibold text-center">Overview</p>

        <div className="flex justify-between my-8 mx-2 lg:gap-24 gap-4">
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

        <div className="mt-4" suppressHydrationWarning>
          <div className="flex justify-between gap-6">
            <SearchBar />
            <AddBudget />
          </div>

          <DataTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
