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
  openModal: (issue) => {
    // 길게 배열이나 객체를 참조해서 문제가 발생하지 않도록 깅은 복사 수행
    const issueCopy = JSON.parse(JSON.stringify(issue));
    set({ isOpen: true, issue: issueCopy });
  },
  closeModal: () => set({ isOpen: false, issue: null }),
}));
