// profile/ui/ProfilePage.tsx
import { useState } from 'react';
import { useParams } from 'react-router';
import { clsx } from 'clsx';
import { User, Briefcase, Activity, Settings } from 'lucide-react';

import { ProfileHeader } from '@/pages/profile/ui/ProfileHeader';
import { ProfileOverview } from '@/pages/profile/ui/ProfileOverview';
import { ProfileProjects } from '@/pages/profile/ui/ProfileProjects';
import { ProfileActivities } from '@/pages/profile/ui/ProfileActivities';
import { ProfileSettings } from '@/pages/profile/ui/ProfileSettings';
import { PROFILE_TABS, ProfileTabType } from '@/pages/profile/model/types';

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const [activeTab, setActiveTab] = useState<string>(PROFILE_TABS[0].id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      <ProfileHeader userId={userId || ''} />

      <main className='flex-1 container mx-auto px-4 py-6 max-w-7xl'>
        <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
          <div className='flex border-b border-gray-200'>
            {PROFILE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={clsx(
                  'px-6 py-4 text-sm font-medium flex items-center gap-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50',
                )}
              >
                {getTabIcon(tab)}
                {tab.name}
              </button>
            ))}
          </div>

          <div className='p-6'>
            {activeTab === 'overview' && <ProfileOverview userId={userId || ''} />}
            {activeTab === 'projects' && <ProfileProjects userId={userId || ''} />}
            {activeTab === 'activities' && <ProfileActivities userId={userId || ''} />}
            {activeTab === 'settings' && <ProfileSettings userId={userId || ''} />}
          </div>
        </div>
      </main>
    </div>
  );
}

function getTabIcon(tab: ProfileTabType) {
  switch (tab.id) {
    case 'overview':
      return <User size={18} />;
    case 'projects':
      return <Briefcase size={18} />;
    case 'activities':
      return <Activity size={18} />;
    case 'settings':
      return <Settings size={18} />;
    default:
      return null;
  }
}
