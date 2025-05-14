// profile/ui/ProfileProjects.tsx
import { useState, useEffect } from 'react';
import { Search, Plus, Clock, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { fetchUserProfile } from '@/pages/profile/api/profile';
import { UserProfile, UserProject } from '@/pages/profile/model/types';

interface ProfileProjectsProps {
  userId: string;
}

export function ProfileProjects({ userId }: ProfileProjectsProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed'>('all');

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
  const sampleProjects: UserProject[] = [
    { id: 'p1', name: 'BIZKIT', role: '프론트엔드 개발자', tasksCount: 12 },
    { id: 'p2', name: '인사관리 시스템', role: '백엔드 개발자', tasksCount: 8 },
    { id: 'p3', name: '모바일 앱', role: '풀스택 개발자', tasksCount: 0 },
    { id: 'p4', name: '데이터 분석 대시보드', role: '프론트엔드 개발자', tasksCount: 5 },
  ];

  const projects = profile?.projects || sampleProjects;

  // 필터링 및 검색
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'active') return matchesSearch && project.tasksCount > 0;
    if (activeFilter === 'completed') return matchesSearch && project.tasksCount === 0;

    return matchesSearch;
  });

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
        <div className='flex gap-2'>
          <button
            onClick={() => setActiveFilter('all')}
            className={clsx(
              'px-3 py-1.5 text-sm font-medium rounded-md',
              activeFilter === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            )}
          >
            모든 프로젝트
          </button>
          <button
            onClick={() => setActiveFilter('active')}
            className={clsx(
              'px-3 py-1.5 text-sm font-medium rounded-md',
              activeFilter === 'active'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            )}
          >
            활성 프로젝트
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={clsx(
              'px-3 py-1.5 text-sm font-medium rounded-md',
              activeFilter === 'completed'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            )}
          >
            완료 프로젝트
          </button>
        </div>

        <div className='flex gap-2 w-full sm:w-auto'>
          <div className='relative flex-1 sm:flex-initial'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <Search size={16} className='text-gray-400' />
            </div>
            <input
              type='text'
              placeholder='프로젝트 검색'
              className='pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button className='flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors'>
            <Plus size={16} />
            <span>프로젝트 추가</span>
          </button>
        </div>
      </div>

      {filteredProjects.length > 0 ? (
        <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
          <div className='grid grid-cols-12 bg-gray-50 text-gray-500 text-sm font-medium'>
            <div className='col-span-5 px-4 py-3'>프로젝트</div>
            <div className='col-span-3 px-4 py-3'>역할</div>
            <div className='col-span-2 px-4 py-3 text-center'>상태</div>
            <div className='col-span-2 px-4 py-3 text-center'>작업</div>
          </div>

          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className='grid grid-cols-12 border-t border-gray-200 text-sm hover:bg-gray-50'
            >
              <div className='col-span-5 px-4 py-3'>
                <div className='font-medium text-gray-900'>{project.name}</div>
              </div>
              <div className='col-span-3 px-4 py-3 text-gray-600'>{project.role}</div>
              <div className='col-span-2 px-4 py-3 flex items-center justify-center'>
                {project.tasksCount > 0 ? (
                  <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800'>
                    <Clock size={12} className='mr-1' />
                    진행 중
                  </span>
                ) : (
                  <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800'>
                    <CheckCircle size={12} className='mr-1' />
                    완료됨
                  </span>
                )}
              </div>
              <div className='col-span-2 px-4 py-3 text-center'>{project.tasksCount}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className='bg-gray-50 rounded-lg p-8 text-center'>
          <p className='text-gray-500'>검색 조건에 맞는 프로젝트가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
