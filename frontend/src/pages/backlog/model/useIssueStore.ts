import { Issue } from '@/entities/issue';
import { create } from 'zustand';

type IssueStore = {
  issues: {
    sprint: {
      [key: number]: Issue[];
    };
    epic: {
      [key: number]: Issue[];
    };
  };
  setIssues: (type: 'sprint' | 'epic', id: number, data: Issue[]) => void;
  moveIssue: (
    issueId: number,
    from: { type: 'sprint' | 'epic'; id: number; index: number },
    to: { type: 'sprint' | 'epic'; id: number; index: number },
  ) => void;
};

export const useIssueStore = create<IssueStore>((set) => ({
  issues: {
    sprint: {},
    epic: {},
  },
  getIssues: (type: 'sprint' | 'epic', id: number) => {
    return useIssueStore.getState().issues[type][id];
  },
  setIssues: (type: 'sprint' | 'epic', id: number, data: Issue[]) => {
    set((state) => {
      const newIssues = { ...state.issues };
      newIssues[type][id] = [...data];
      return { issues: newIssues };
    });
  },
  moveIssue: (issueId, from, to) => {
    set((state) => {
      const newIssues = { ...state.issues };
      const targetIssue = state.issues[from.type][from.id].find((issue) => issue.id === issueId);

      if (!targetIssue) return { issues: newIssues };

      newIssues[from.type][from.id] = state.issues[from.type][from.id].filter(
        (issue) => issue.id !== issueId,
      );
      newIssues[to.type][to.id].splice(to.index, 0, targetIssue);

      return { issues: newIssues };
    });
  },
}));
