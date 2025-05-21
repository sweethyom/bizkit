import { Home } from 'lucide-react';
import { useNavigate } from 'react-router';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen cursor-default bg-gradient-to-b from-indigo-50 via-white to-blue-50 font-sans'>
      <div className='flex min-h-screen flex-col items-center justify-center px-4 text-center'>
        <div className='animate-gradient-x mb-8 bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-9xl font-extrabold text-transparent'>
          404
        </div>

        <h1 className='mb-4 text-4xl font-bold text-gray-900'>페이지를 찾을 수 없습니다</h1>

        <div>
          <p className='mb-10 max-w-lg text-lg text-gray-600'>
            요청하신 페이지가 삭제되었거나 잘못된 경로일 수 있습니다.
            <br />
            아래 버튼을 클릭하여 홈으로 돌아가실 수 있습니다.
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className='inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-indigo-600 hover:to-blue-600'
        >
          <Home className='h-5 w-5' />
          홈으로 돌아가기
        </button>

        <div className='absolute bottom-0 left-1/2 -translate-x-1/2 transform'>
          <div className='h-40 w-40 rounded-full bg-gradient-to-br from-indigo-400 to-blue-600 opacity-10 blur-3xl'></div>
        </div>
      </div>
    </div>
  );
}
