import { Epic } from '@/entities/epic/model/epic';
import { create } from 'zustand';

interface EpicStore {
  epics: Epic[];
  setEpics: (epics: Epic[]) => void;
  addEpic: (epic: Epic) => void;
  updateEpicName: (epicId: number, name: string) => void;
}

export const useEpicStore = create<EpicStore>((set) => ({
  epics: [],
  setEpics: (epics: Epic[]) => set({ epics }),
  addEpic: (epic: Epic) => set((state) => ({ epics: [...state.epics, epic] })),
  updateEpicName: (epicId: number, name: string) =>
    set((state) => ({
      epics: state.epics.map((epic) => (epic.id === epicId ? { ...epic, name } : epic)),
    })),
}));
