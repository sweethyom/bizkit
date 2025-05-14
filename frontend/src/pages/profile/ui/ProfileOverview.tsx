// profile/ui/ProfileOverview.tsx
import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  Briefcase,
  Activity,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';
import { fetchUserProfile } from '@/pages/profile/api/profile';
import { UserProfile, UserActivity } from '@/pages/profile/model/types';

interface ProfileOverviewProps {
  userId: string;
}

export function ProfileOverview({ userId }: ProfileOverviewProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const data = await fetchUserProfile(userId);
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      loadProfile();
    }
  }, [userId]);

  if (isLoading) {
    return (
      <div className='animate-pulse space-y-6'>
        <div className='h-40 bg-slate-200 rounded'></div>
        <div className='h-60 bg-slate-200 rounded'></div>
      </div>
    );
  }

  // 데이터가 없을 경우 대체할 샘플 데이터
  const sampleProfile: UserProfile = {
    id: userId,
    name: '김개발',
    email: 'dev.kim@example.com',
    role: '프론트엔드 개발자',
    department: '개발팀',
    position: '주니어 개발자',
    bio: '사용자 경험을 향상시키는 프론트엔드 개발자입니다.',
    projects: [
      { id: 'p1', name: 'BIZKIT', role: '프론트엔드 개발자', tasksCount: 12 },
      { id: 'p2', name: '인사관리 시스템', role: '백엔드 개발자', tasksCount: 8 },
    ],
    activities: [
      {
        id: 'a1',
        type: 'task',
        projectId: 'p1',
        projectName: 'BIZKIT',
        content: '프로필 페이지 UI 개선',
        date: '2025-05-10',
        status: 'in_progress',
        priority: 'high',
      },
      {
        id: 'a2',
        type: 'comment',
        projectId: 'p1',
        projectName: 'BIZKIT',
        content: '로그인 화면 디자인 리뷰 진행',
        date: '2025-05-09',
      },
      {
        id: 'a3',
        type: 'update',
        projectId: 'p2',
        projectName: '인사관리 시스템',
        content: 'API 엔드포인트 문서화 완료',
        date: '2025-05-08',
        status: 'done',
      },
    ],
    skills: ['React', 'TypeScript', 'TailwindCSS', 'Node.js'],
  };

  const userProfile = profile || sampleProfile;
  const recentActivities = userProfile.activities.slice(0, 5);
  const projectsInProgress = userProfile.projects.filter((project) => project.tasksCount > 0);

  return (
    <div className='space-y-8'>
      <section>
        <h2 className='text-xl font-semibold text-gray-900 mb-4'>활동 요약</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='bg-blue-50 rounded-lg p-5'>
            <div className='flex items-start justify-between'>
              <div>
                <p className='text-sm text-blue-600 font-medium'>프로젝트</p>
                <p className='text-2xl font-bold text-gray-900 mt-1'>
                  {userProfile.projects.length}
                </p>
              </div>
              <div className='bg-blue-100 p-2 rounded-lg'>
                <Briefcase size={20} className='text-blue-500' />
              </div>
            </div>
          </div>

          <div className='bg-green-50 rounded-lg p-5'>
            <div className='flex items-start justify-between'>
              <div>
                <p className='text-sm text-green-600 font-medium'>완료한 작업</p>
                <p className='text-2xl font-bold text-gray-900 mt-1'>
                  {userProfile.activities.filter((a) => a.status === 'done').length}
                </p>
              </div>
              <div className='bg-green-100 p-2 rounded-lg'>
                <CheckCircle size={20} className='text-green-500' />
              </div>
            </div>
          </div>

          <div className='bg-amber-50 rounded-lg p-5'>
            <div className='flex items-start justify-between'>
              <div>
                <p className='text-sm text-amber-600 font-medium'>진행 중인 작업</p>
                <p className='text-2xl font-bold text-gray-900 mt-1'>
                  {userProfile.activities.filter((a) => a.status === 'in_progress').length}
                </p>
              </div>
              <div className='bg-amber-100 p-2 rounded-lg'>
                <Clock size={20} className='text-amber-500' />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className='text-xl font-semibold text-gray-900 mb-4'>진행 중인 프로젝트</h2>
        {projectsInProgress.length > 0 ? (
          <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
            <div className='grid grid-cols-12 bg-gray-50 text-gray-500 text-sm font-medium'>
              <div className='col-span-5 px-4 py-3'>프로젝트</div>
              <div className='col-span-3 px-4 py-3'>역할</div>
              <div className='col-span-2 px-4 py-3 text-center'>작업</div>
              <div className='col-span-2 px-4 py-3'></div>
            </div>

            {projectsInProgress.map((project) => (
              <div key={project.id} className='grid grid-cols-12 border-t border-gray-200 text-sm'>
                <div className='col-span-5 px-4 py-3 font-medium text-gray-900'>{project.name}</div>
                <div className='col-span-3 px-4 py-3 text-gray-600'>{project.role}</div>
                <div className='col-span-2 px-4 py-3 text-center'>{project.tasksCount}</div>
                <div className='col-span-2 px-4 py-3 text-right'>
                  <button className='text-blue-600 hover:text-blue-800 font-medium'>
                    상세보기
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='bg-gray-50 rounded-lg p-8 text-center'>
            <p className='text-gray-500'>진행 중인 프로젝트가 없습니다.</p>
          </div>
        )}
      </section>

      <section>
        <h2 className='text-xl font-semibold text-gray-900 mb-4'>최근 활동</h2>
        {recentActivities.length > 0 ? (
          <div className='space-y-4'>
            {recentActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <div className='bg-gray-50 rounded-lg p-8 text-center'>
            <p className='text-gray-500'>최근 활동이 없습니다.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function ActivityItem({ activity }: { activity: UserActivity }) {
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'task':
        return <CheckCircle size={16} className='text-green-500' />;
      case 'comment':
        return <MessageSquare size={16} className='text-blue-500' />;
      case 'update':
        return <RefreshCw size={16} className='text-amber-500' />;
      default:
        return <Activity size={16} className='text-gray-500' />;
    }
  };

  const getActivityStatus = () => {
    if (!activity.status) return null;

    switch (activity.status) {
      case 'done':
        return (
          <span className='text-xs bg-green-100 text-green-700 rounded px-2 py-0.5'>완료</span>
        );
      case 'in_progress':
        return (
          <span className='text-xs bg-amber-100 text-amber-700 rounded px-2 py-0.5'>진행 중</span>
        );
      default:
        return (
          <span className='text-xs bg-gray-100 text-gray-700 rounded px-2 py-0.5'>
            {activity.status}
          </span>
        );
    }
  };

  return (
    <div className='flex items-start gap-3 p-4 rounded-lg bg-white border border-gray-200'>
      <div className='bg-gray-100 rounded-full p-2 mt-0.5'>{getActivityIcon()}</div>
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2 mb-1'>
          <span className='font-medium text-gray-900'>{activity.projectName}</span>
          {getActivityStatus()}
          {activity.priority === 'high' && (
            <span className='text-xs bg-red-100 text-red-700 rounded px-2 py-0.5'>
              높은 우선순위
            </span>
          )}
        </div>
        <p className='text-gray-700'>{activity.content}</p>
        <div className='flex items-center gap-2 mt-2 text-xs text-gray-500'>
          <Calendar size={14} />
          <span>{activity.date}</span>
        </div>
      </div>
    </div>
  );
}
