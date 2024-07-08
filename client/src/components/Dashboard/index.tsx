'use client';

import { useUserData } from '@/hooks/user/useUser';

const Dashboard = () => {
  const { isPending: userLoading, data: currentUser } = useUserData();

  if (!userLoading) {
    console.log(currentUser);
  }

  const firstName = currentUser?.firstName;
  //  Income Icon -  import PaymentsIcon from '@mui/icons-material/Payments';
  //  Expense Icon - import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
  // Total Balance - import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
  return (
    <div className="">
      <span className="text-xl"> Hi,{firstName} 👋</span>
    </div>
  );
};

export default Dashboard;
