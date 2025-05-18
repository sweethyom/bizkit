// invitation/ui/InvitationPage.tsx
import { acceptInvitation, getInvitationProjectInfo } from '@/pages/invitation/api/invitationApi';
import { ProjectInvitation } from '@/pages/invitation/model/types';
import { clsx } from 'clsx';
import {
  AlertCircle,
  ArrowLeft,
  Building,
  CheckCircle,
  Loader,
  UserPlus,
  Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

const InvitationPage: React.FC = () => {
  const { invitationId } = useParams<{ invitationId: string }>();
  const navigate = useNavigate();

  const [projectInfo, setProjectInfo] = useState<ProjectInvitation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAccepting, setIsAccepting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 초대 정보 조회
  useEffect(() => {
    const fetchInvitationInfo = async () => {
      if (!invitationId) {
        setError('유효하지 않은 초대 링크입니다.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await getInvitationProjectInfo(invitationId);
        setProjectInfo(data);
      } catch (err) {
        console.error('초대 정보 조회 오류:', err);
        setError(err instanceof Error ? err.message : '초대 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvitationInfo();
  }, [invitationId]);

  // 초대 수락 처리
  const handleAcceptInvitation = async () => {
    if (!invitationId) return;

    try {
      setIsAccepting(true);
      setError(null);
      const success = await acceptInvitation(invitationId);
      
      if (success) {
        setSuccess('프로젝트 초대를 수락했습니다.');
        // 3초 후 프로젝트 페이지로 이동
        setTimeout(() => {
          // 성공 후 이동할 페이지 (예: 프로젝트 페이지)
          navigate(`/projects/${projectInfo?.id}`);
        }, 3000);
      }
    } catch (err) {
      console.error('초대 수락 오류:', err);
      setError(err instanceof Error ? err.message : '초대 수락에 실패했습니다.');
    } finally {
      setIsAccepting(false);
    }
  };

  // 뒤로 가기
  const handleGoBack = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className={clsx('flex min-h-screen flex-col items-center justify-center bg-gray-50')}>
        <div className={clsx('text-center')}>
          <Loader className={clsx('mx-auto h-12 w-12 animate-spin text-indigo-600')} />
          <h2 className={clsx('mt-4 text-lg font-medium text-gray-900')}>
            초대 정보를 불러오는 중...
          </h2>
          <p className={clsx('mt-2 text-sm text-gray-500')}>잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={clsx('flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4')}
      >
        <div className={clsx('w-full max-w-md rounded-lg bg-white p-8 shadow-md')}>
          <div className={clsx('text-center')}>
            <div
              className={clsx(
                'mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100',
              )}
            >
              <AlertCircle className={clsx('h-6 w-6 text-red-600')} />
            </div>
            <h2 className={clsx('mt-4 text-lg font-medium text-gray-900')}>초대 정보 오류</h2>
            <p className={clsx('mt-2 text-sm text-gray-500')}>{error}</p>
            <button
              onClick={handleGoBack}
              className={clsx(
                'mt-6 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none',
              )}
            >
              <ArrowLeft className={clsx('mr-2 -ml-1 h-5 w-5')} aria-hidden='true' />
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx('flex min-h-screen bg-gray-50')}>
      <div className={clsx('m-auto w-full max-w-lg px-4 py-16 sm:px-6 sm:py-24')}>
        <div className={clsx('overflow-hidden rounded-2xl bg-white shadow')}>
          {/* 헤더 */}
          <div className={clsx('bg-indigo-600 px-6 py-8 sm:p-10 sm:pb-6')}>
            <div className={clsx('flex items-center justify-center')}>
              <h2 className={clsx('text-center text-3xl font-bold tracking-tight text-white')}>
                프로젝트 초대
              </h2>
            </div>
          </div>

          {/* 성공 메시지 */}
          {success && (
            <div
              className={clsx(
                'animate-fadeIn mx-6 mt-6 flex items-start rounded-md border-l-4 border-green-500 bg-green-50 p-4 text-green-700',
              )}
            >
              <CheckCircle className={clsx('mr-3 h-5 w-5 flex-shrink-0')} />
              <span className={clsx('text-sm')}>{success}</span>
            </div>
          )}

          {/* 프로젝트 정보 */}
          <div className={clsx('px-6 pt-6 pb-8 sm:p-10')}>
            <div className={clsx('space-y-4')}>
              {/* 프로젝트 이미지 */}
              <div className={clsx('flex justify-center')}>
                <div
                  className={clsx(
                    'h-24 w-24 overflow-hidden rounded-full bg-indigo-100 shadow-inner',
                  )}
                >
                  {projectInfo?.image ? (
                    <img
                      src={projectInfo.image}
                      alt={`${projectInfo.name} 프로젝트 이미지`}
                      className={clsx('h-full w-full object-cover')}
                    />
                  ) : (
                    <div className={clsx('flex h-full w-full items-center justify-center')}>
                      <Building className={clsx('h-12 w-12 text-indigo-400')} />
                    </div>
                  )}
                </div>
              </div>

              {/* 프로젝트 이름 */}
              <h3 className={clsx('text-center text-2xl font-bold text-gray-900')}>
                {projectInfo?.name}
              </h3>

              {/* 팀장 정보 */}
              <div className={clsx('mt-4 flex items-center justify-center')}>
                <div className={clsx('flex items-center space-x-3')}>
                  <div className={clsx('h-10 w-10 overflow-hidden rounded-full bg-indigo-100')}>
                    {projectInfo?.leader.image ? (
                      <img
                        src={projectInfo.leader.image}
                        alt={`${projectInfo.leader.nickname}의 프로필`}
                        className={clsx('h-full w-full object-cover')}
                      />
                    ) : (
                      <div className={clsx('flex h-full w-full items-center justify-center')}>
                        <Users className={clsx('h-5 w-5 text-indigo-400')} />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className={clsx('text-sm font-medium text-gray-500')}>팀장</p>
                    <p className={clsx('text-base font-semibold text-gray-900')}>
                      {projectInfo?.leader.nickname}
                    </p>
                  </div>
                </div>
              </div>

              <div className={clsx('mt-8 border-t border-gray-200 pt-6')}>
                <p className={clsx('text-center text-sm text-gray-500')}>
                  {projectInfo?.name} 프로젝트에 초대되었습니다. <br />
                  팀에 참여하시겠습니까?
                </p>
              </div>

              {/* 버튼 그룹 */}
              <div className={clsx('mt-6 flex justify-center space-x-4')}>
                <button
                  type='button'
                  onClick={handleGoBack}
                  disabled={isAccepting || !!success}
                  className={clsx(
                    'inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none',
                    (isAccepting || !!success) && 'cursor-not-allowed opacity-50',
                  )}
                >
                  <ArrowLeft className={clsx('mr-2 -ml-1 h-5 w-5')} aria-hidden='true' />
                  취소
                </button>
                <button
                  type='button'
                  onClick={handleAcceptInvitation}
                  disabled={isAccepting || !!success}
                  className={clsx(
                    'inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none',
                    (isAccepting || !!success) && 'cursor-not-allowed opacity-50',
                  )}
                >
                  {isAccepting ? (
                    <>
                      <Loader className={clsx('mr-2 -ml-1 h-5 w-5 animate-spin')} />
                      처리 중...
                    </>
                  ) : (
                    <>
                      <UserPlus className={clsx('mr-2 -ml-1 h-5 w-5')} aria-hidden='true' />팀
                      참여하기
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationPage;
