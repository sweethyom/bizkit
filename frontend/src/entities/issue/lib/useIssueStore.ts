import { Issue } from '@/entities/issue';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  addIssue: (issue: Issue) => void;
};

export const useIssueStore = create<IssueStore>()(
  persist(
    (set, get) => ({
      issues: {
        sprint: {},
        epic: {},
      },
      getIssues: (type: 'sprint' | 'epic', id: number) => {
        return get().issues[type][id];
      },
      addIssue: (issue: Issue) => {
        set((state) => {
          const newIssues = { ...state.issues };
          newIssues['epic'][issue.epic!.id] = [
            ...(state.issues['epic'][issue.epic!.id] || []),
            issue,
          ];
          return { issues: newIssues };
        });
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
          const targetIssue = state.issues[from.type][from.id].find(
            (issue) => issue.id === issueId,
          );

          if (!targetIssue) return { issues: newIssues };

          if (!newIssues[to.type][to.id]) {
            newIssues[to.type][to.id] = [];
          }

          newIssues[from.type][from.id] = state.issues[from.type][from.id].filter(
            (issue) => issue.id !== issueId,
          );

          newIssues[to.type][to.id].unshift(targetIssue);

          return { issues: newIssues };
        });
      },
    }),
    {
      name: 'issues',
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
