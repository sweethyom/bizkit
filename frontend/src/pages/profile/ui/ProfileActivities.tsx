// profile/ui/ProfileActivities.tsx
import { useState, useEffect } from 'react';
import {
  Calendar,
  Search,
  Filter,
  Activity,
  CheckCircle,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';
import { clsx } from 'clsx';
import { fetchUserProfile } from '@/pages/profile/api/profile';
import { UserProfile, UserActivity } from '@/pages/profile/model/types';

interface ProfileActivitiesProps {
  userId: string;
}

export function ProfileActivities({ userId }: ProfileActivitiesProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [activityTypes, setActivityTypes] = useState<string[]>(['task', 'comment', 'update']);
  const [dateRange, setDateRange] = useState<{ start: string | null; end: string | null }>({
    start: null,
    end: null,
  });

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
        <div className='h-10 bg-slate-200 rounded w-full'></div>
        <div className='h-80 bg-slate-200 rounded'></div>
      </div>
    );
  }

  // 데이터가 없을 경우 대체할 샘플 데이터
  const sampleActivities: UserActivity[] = [
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
    {
      id: 'a4',
      type: 'task',
      projectId: 'p2',
      projectName: '인사관리 시스템',
      content: '사용자 관리 페이지 개발',
      date: '2025-05-07',
      status: 'done',
    },
    {
      id: 'a5',
      type: 'update',
      projectId: 'p1',
      projectName: 'BIZKIT',
      content: '대시보드 성능 최적화',
      date: '2025-05-06',
      status: 'in_progress',
    },
  ];

  const activities = profile?.activities || sampleActivities;

  // 필터링 및 검색
  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.projectName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = activityTypes.includes(activity.type);

    // 날짜 필터
    let matchesDate = true;
    if (dateRange.start) {
      matchesDate = matchesDate && new Date(activity.date) >= new Date(dateRange.start);
    }
    if (dateRange.end) {
      matchesDate = matchesDate && new Date(activity.date) <= new Date(dateRange.end);
    }

    return matchesSearch && matchesType && matchesDate;
  });

  const toggleActivityType = (type: string) => {
    if (activityTypes.includes(type)) {
      setActivityTypes(activityTypes.filter((t) => t !== type));
    } else {
      setActivityTypes([...activityTypes, type]);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='relative flex-1'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Search size={16} className='text-gray-400' />
          </div>
          <input
            type='text'
            placeholder='활동 내역 검색'
            className='pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className='relative'>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 border rounded-md',
              filterOpen
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50',
            )}
          >
            <Filter size={16} />
            <span>필터</span>
          </button>

          {filterOpen && (
            <div className='absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 p-4 border border-gray-200'>
              <div className='space-y-4'>
                <div>
                  <h3 className='text-sm font-medium text-gray-700 mb-2'>활동 유형</h3>
                  <div className='space-y-2'>
                    <div className='flex items-center'>
                      <input
                        id='filter-task'
                        type='checkbox'
                        className='h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500'
                        checked={activityTypes.includes('task')}
                        onChange={() => toggleActivityType('task')}
                      />
                      <label htmlFor='filter-task' className='ml-2 text-sm text-gray-700'>
                        작업
                      </label>
                    </div>
                    <div className='flex items-center'>
                      <input
                        id='filter-comment'
                        type='checkbox'
                        className='h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500'
                        checked={activityTypes.includes('comment')}
                        onChange={() => toggleActivityType('comment')}
                      />
                      <label htmlFor='filter-comment' className='ml-2 text-sm text-gray-700'>
                        댓글
                      </label>
                    </div>
                    <div className='flex items-center'>
                      <input
                        id='filter-update'
                        type='checkbox'
                        className='h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500'
                        checked={activityTypes.includes('update')}
                        onChange={() => toggleActivityType('update')}
                      />
                      <label htmlFor='filter-update' className='ml-2 text-sm text-gray-700'>
                        업데이트
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className='text-sm font-medium text-gray-700 mb-2'>날짜 범위</h3>
                  <div className='space-y-2'>
                    <div>
                      <label htmlFor='date-start' className='block text-xs text-gray-500'>
                        시작일
                      </label>
                      <input
                        id='date-start'
                        type='date'
                        className='w-full mt-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md'
                        value={dateRange.start || ''}
                        onChange={(e) =>
                          setDateRange({ ...dateRange, start: e.target.value || null })
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor='date-end' className='block text-xs text-gray-500'>
                        종료일
                      </label>
                      <input
                        id='date-end'
                        type='date'
                        className='w-full mt-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md'
                        value={dateRange.end || ''}
                        onChange={(e) =>
                          setDateRange({ ...dateRange, end: e.target.value || null })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className='flex justify-end pt-2'>
                  <button
                    onClick={() => {
                      setActivityTypes(['task', 'comment', 'update']);
                      setDateRange({ start: null, end: null });
                    }}
                    className='text-sm text-gray-500 hover:text-gray-700 mr-3'
                  >
                    초기화
                  </button>
                  <button
                    onClick={() => setFilterOpen(false)}
                    className='px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700'
                  >
                    적용
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {filteredActivities.length > 0 ? (
        <div className='space-y-4'>
          {filteredActivities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <div className='bg-gray-50 rounded-lg p-8 text-center'>
          <p className='text-gray-500'>활동 내역이 없습니다.</p>
        </div>
      )}
    </div>
  );
}

function ActivityItem({ activity }: { activity: UserActivity }) {
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'task':
        return <CheckCircle size={18} className='text-green-500' />;
      case 'comment':
        return <MessageSquare size={18} className='text-blue-500' />;
      case 'update':
        return <RefreshCw size={18} className='text-amber-500' />;
      default:
        return <Activity size={18} className='text-gray-500' />;
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
    <div className='flex items-start gap-3 p-4 rounded-lg bg-white border border-gray-200 hover:shadow-sm transition-shadow'>
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
