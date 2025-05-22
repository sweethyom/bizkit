import { Project, ProjectList } from '@/entities/project';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ProjectStore = {
  projects: ProjectList | null;
  project: Project;
  setProjects: (projects: ProjectList) => void;
  setProject: (project: Project) => void;
  addProject: (project: Project) => void;
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
      setProject: (project: Project) => set({ project }),
      addProject: (project: Project) =>
        set((state) => ({
          projects: [{ ...project, todoCount: 0 }, ...(state.projects || [])],
        })),
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
