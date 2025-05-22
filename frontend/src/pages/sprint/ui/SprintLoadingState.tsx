import { Loader2 } from 'lucide-react';

export const SprintLoadingState: React.FC = () => {
  return (
    <div className='flex h-screen flex-col items-center justify-center bg-gray-50'>
      <div className='flex flex-col items-center justify-center rounded-lg bg-white p-8 shadow-lg'>
        <Loader2 className='text-primary mb-4 h-12 w-12 animate-spin' />
        <p className='text-lg font-medium text-gray-700'>스프린트 데이터를 불러오는 중...</p>
      </div>
    </div>
  );
};
