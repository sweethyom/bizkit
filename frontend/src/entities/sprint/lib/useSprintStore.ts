import { Sprint, SprintStatus } from '@/entities/sprint/model/sprint';
import { create } from 'zustand';

interface SprintStore {
  sprints: Sprint[];
  setSprints: (sprints: Sprint[]) => void;
  addSprint: (sprint: Sprint) => void;
  updateSprint: (sprint: Sprint) => void;
  updateSprintName: (sprintId: number, name: string) => void;
  updateSprintStatus: (sprintId: number, status: SprintStatus) => void;
}

export const useSprintStore = create<SprintStore>((set) => ({
  sprints: [],
  setSprints: (sprints: Sprint[]) => set({ sprints }),
  addSprint: (sprint: Sprint) => set((state) => ({ sprints: [...state.sprints, sprint] })),
  updateSprint: (sprint: Sprint) =>
    set((state) => ({ sprints: state.sprints.map((s) => (s.id === sprint.id ? sprint : s)) })),
  updateSprintName: (sprintId: number, name: string) =>
    set((state) => ({
      sprints: state.sprints.map((s) => (s.id === sprintId ? { ...s, name } : s)),
    })),
  updateSprintStatus: (sprintId: number, status: SprintStatus) =>
    set((state) => ({
      sprints: state.sprints.map((s) => (s.id === sprintId ? { ...s, sprintStatus: status } : s)),
    })),
}));
