// profile/ui/ProfileHeader.tsx
import { useState, useEffect } from 'react';
import { Mail, Building2, Award, Edit3 } from 'lucide-react';
import { clsx } from 'clsx';
import { fetchUserProfile } from '@/pages/profile/api/profile';
import { UserProfile } from '@/pages/profile/model/types';

interface ProfileHeaderProps {
  userId: string;
}

export function ProfileHeader({ userId }: ProfileHeaderProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const data = await fetchUserProfile(userId);
        setProfile(data);
      } catch (err) {
        setError('프로필을 불러오는데 실패했습니다');
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
      <div className='bg-gradient-to-r from-blue-600 to-indigo-700 py-12 px-4'>
        <div className='animate-pulse flex space-x-6 max-w-7xl mx-auto items-center'>
          <div className='rounded-full bg-slate-200 h-24 w-24'></div>
          <div className='flex-1 space-y-4'>
            <div className='h-6 bg-slate-200 rounded w-1/4'></div>
            <div className='h-4 bg-slate-200 rounded w-2/3'></div>
            <div className='h-4 bg-slate-200 rounded w-1/2'></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-gradient-to-r from-blue-600 to-indigo-700 py-12 px-4 text-white'>
        <div className='max-w-7xl mx-auto'>
          <p className='text-lg'>{error}</p>
        </div>
      </div>
    );
  }

  // 프로필 정보가 없는 경우 기본 데이터로 대체
  const defaultProfile: UserProfile = {
    id: userId,
    name: '사용자',
    email: 'user@example.com',
    role: '개발자',
    projects: [],
    activities: [],
    skills: [],
  };

  const userProfile = profile || defaultProfile;

  return (
    <div className='bg-gradient-to-r from-blue-600 to-indigo-700 py-12 px-4'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col md:flex-row items-start md:items-center gap-6'>
          <div className='relative'>
            {userProfile.profileImage ? (
              <img
                src={userProfile.profileImage}
                alt={userProfile.name}
                className='w-24 h-24 rounded-full border-4 border-white object-cover'
              />
            ) : (
              <div className='w-24 h-24 rounded-full bg-white flex items-center justify-center text-blue-600 text-2xl font-bold'>
                {userProfile.name.charAt(0).toUpperCase()}
              </div>
            )}
            <button
              className='absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-colors'
              aria-label='프로필 이미지 수정'
            >
              <Edit3 size={16} className='text-blue-600' />
            </button>
          </div>

          <div className='flex-1'>
            <div className='flex flex-col md:flex-row md:items-center gap-2 md:gap-6'>
              <h1 className='text-2xl md:text-3xl font-bold text-white'>{userProfile.name}</h1>
              <div className='flex items-center gap-2 text-blue-100'>
                <Award size={18} />
                <span className='text-sm font-medium'>{userProfile.role}</span>
              </div>
              {userProfile.department && (
                <div className='flex items-center gap-2 text-blue-100'>
                  <Building2 size={18} />
                  <span className='text-sm'>{userProfile.department}</span>
                </div>
              )}
            </div>

            <div className='mt-2 flex items-center gap-2 text-blue-100'>
              <Mail size={16} />
              <span>{userProfile.email}</span>
            </div>

            {userProfile.bio && <p className='mt-4 text-blue-100 max-w-2xl'>{userProfile.bio}</p>}

            {userProfile.skills && userProfile.skills.length > 0 && (
              <div className='mt-4 flex flex-wrap gap-2'>
                {userProfile.skills.map((skill) => (
                  <span
                    key={skill}
                    className='bg-blue-500 bg-opacity-30 text-white text-xs px-2.5 py-1 rounded-full'
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            className={clsx(
              'px-4 py-2 rounded-md font-medium transition-colors',
              'bg-white text-blue-600 hover:bg-blue-50',
              'md:self-start mt-4 md:mt-0',
            )}
          >
            프로필 수정
          </button>
        </div>
      </div>
    </div>
  );
}
