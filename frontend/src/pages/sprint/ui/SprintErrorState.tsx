import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router';

interface SprintErrorStateProps {
  error: string;
  projectId?: string;
}

export const SprintErrorState: React.FC<SprintErrorStateProps> = ({ error, projectId }) => {
  const isNoIssuesError = error.includes('이슈가 없습니다');
  const isNoSprintError = error.includes('스프린트가 존재하지 않습니다');

  return (
    <div className='flex h-screen flex-col items-center justify-center bg-gray-50'>
      <div className='w-full max-w-md rounded-lg bg-white p-8 shadow-lg'>
        <div className='mb-4 flex items-center gap-3'>
          <AlertCircle
            className={`h-8 w-8 ${isNoIssuesError ? 'text-blue-500' : 'text-warning'}`}
          />
          <h2 className='text-xl font-semibold text-gray-800'>
            {isNoIssuesError ? '알림' : '오류가 발생했습니다'}
          </h2>
        </div>
        <p className='mb-6 text-gray-600'>{error}</p>
        <div className='flex flex-col space-y-3'>
          {isNoSprintError && projectId && (
            <button
              onClick={() => {
                // 스프린트 생성 페이지로 이동
                window.location.href = `/projects/${projectId}/sprint/create`;
              }}
              className='bg-primary hover:bg-primary/80 w-full rounded-md py-2 font-medium text-white transition-colors'
            >
              스프린트 생성하기
            </button>
          )}

          {isNoIssuesError && projectId && (
            <Link
              to={`/projects/${projectId}/backlog`}
              className='bg-primary hover:bg-primary/80 w-full rounded-md py-2 text-center font-medium text-white transition-colors'
            >
              백로그에서 이슈 추가하기
            </Link>
          )}

          <button
            onClick={() => window.location.reload()}
            className={`w-full rounded-md py-2 font-medium transition-colors ${isNoSprintError || isNoIssuesError
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-primary hover:bg-primary/80 text-white'
              }`}
          >
            다시 시도
          </button>
        </div>
      </div>
    </div>
  );
};
