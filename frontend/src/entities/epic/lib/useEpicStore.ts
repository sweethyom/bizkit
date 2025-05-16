import { Epic } from '@/entities/epic/model/epic';
import { create } from 'zustand';

interface EpicStore {
  epics: Epic[];
  setEpics: (epics: Epic[]) => void;
  addEpic: (epic: Epic) => void;
}

export const useEpicStore = create<EpicStore>((set) => ({
  epics: [],
  setEpics: (epics: Epic[]) => set({ epics }),
  addEpic: (epic: Epic) => set((state) => ({ epics: [...state.epics, epic] })),
}));
