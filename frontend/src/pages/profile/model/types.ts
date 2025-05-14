// profile/model/types.ts
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  role: string;
  department?: string;
  position?: string;
  bio?: string;
  projects: UserProject[];
  activities: UserActivity[];
  skills: string[];
}

export interface UserProject {
  id: string;
  name: string;
  role: string;
  tasksCount: number;
}

export interface UserActivity {
  id: string;
  type: 'task' | 'comment' | 'update';
  projectId: string;
  projectName: string;
  content: string;
  date: string;
  status?: string;
  priority?: string;
}

export interface ProfileTabType {
  id: string;
  name: string;
}

export const PROFILE_TABS: ProfileTabType[] = [
  { id: 'overview', name: '개요' },
  { id: 'projects', name: '프로젝트' },
  { id: 'activities', name: '활동' },
  { id: 'settings', name: '설정' },
];
