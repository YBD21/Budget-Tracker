'use client';

import { useUserData } from '@/hooks/user/useUser';
import NavBar from '../NavBar';

const Dashboard = () => {
  const { isPending: userLoading, data: currentUser } = useUserData();
  if (!userLoading) {
    console.log(currentUser);
  }

  return (
    <NavBar>
      <div className="text-red-700 dark:text-blue-300"> Dashboard </div>
    </NavBar>
  );
};

export default Dashboard;
