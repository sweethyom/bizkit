import { ProjectDetail, ProjectList } from '@/shared/model';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ProjectStore = {
  projects: ProjectList | null;
  project: ProjectDetail;
  setProjects: (projects: ProjectList) => void;
  setProject: (project: ProjectDetail) => void;
};

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      projects: null,
      project: {
        id: 0,
        name: 'TEST',
        key: 'TEST',
        image: '',
        leader: false,
      },
      setProjects: (projects: ProjectList) => set({ projects }),
      setProject: (project: ProjectDetail) => set({ project }),
    }),
    {
      name: 'project-store',
      storage: {
        getItem: (name) => {
          const item = sessionStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
    },
  ),
);
