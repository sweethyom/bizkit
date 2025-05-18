import { create } from 'zustand';
import { Assignee } from '../model/user';

interface AssigneeStore {
  assignee: Assignee | null;
  setAssignee: (assignee: Assignee) => void;
}

export const useAssigneeStore = create<AssigneeStore>((set) => ({
  assignee: null,
  setAssignee: (assignee) => set({ assignee }),
}));
