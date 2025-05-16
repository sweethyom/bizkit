import { TopNavBar } from '@/widgets/top-navigation-bar';
import { Outlet } from 'react-router';

const DefaultLayout = () => {
  return (
    <div className='bg-background-primary flex h-full w-full flex-col'>
      <TopNavBar />
      <Outlet />
    </div>
  );
};

export default DefaultLayout;
