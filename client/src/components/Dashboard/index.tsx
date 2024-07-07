'use client';

import { useUserData } from '@/hooks/user/useUser';

const Dashboard = () => {
  const { isPending: userLoading, data: currentUser } = useUserData();
  if (!userLoading) {
    console.log(currentUser);
  }

  return <div className="text-red-700 dark:text-blue-300"> Dashboard </div>;
};

export default Dashboard;
