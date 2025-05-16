import { Sprint } from '@/entities/sprint/model/sprint';
import { create } from 'zustand';

interface SprintStore {
  sprints: Sprint[];
  setSprints: (sprints: Sprint[]) => void;
  addSprint: (sprint: Sprint) => void;
  updateSprint: (sprint: Sprint) => void;
}

export const useSprintStore = create<SprintStore>((set) => ({
  sprints: [],
  setSprints: (sprints: Sprint[]) => set({ sprints }),
  addSprint: (sprint: Sprint) => set((state) => ({ sprints: [...state.sprints, sprint] })),
  updateSprint: (sprint: Sprint) =>
    set((state) => ({ sprints: state.sprints.map((s) => (s.id === sprint.id ? sprint : s)) })),
}));
