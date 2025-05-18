import { Issue } from '@/entities/issue';
import { create } from 'zustand';

interface IssueModalStore {
  isOpen: boolean;
  issue: Issue | null;
  openModal: (issue: Issue) => void;
  closeModal: () => void;
}

export const useIssueModalStore = create<IssueModalStore>((set) => ({
  isOpen: false,
  issue: null,
  openModal: (issue) => set({ isOpen: true, issue }),
  closeModal: () => set({ isOpen: false, issue: null }),
}));
