export type IssueStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'UNASSIGNED';
export type IssueImportance = 'HIGH' | 'LOW';
export type SprintStatus = 'READY' | 'ONGOING' | 'COMPLETED' | null;

interface Assignee {
  id: number | null;
  nickname: string;
  profileImageUrl: string | null;
}

interface Epic {
  id: number;
  name: string;
  key: string;
}

export interface Sprint {
  id: number;
  name: string;
  sprintStatus: SprintStatus;
}

export interface Issue {
  id: number;
  name: string;
  content?: string;
  key: string;
  bizPoint?: number;
  issueImportance: IssueImportance | null;
  issueStatus: IssueStatus;
  project?: {
    id: number;
    name: string;
  };
  component?: {
    id: number | null;
    name: string;
  };
  user?: Assignee;
  assignee?: Assignee;
  sprint?: Sprint;
  epic?: Epic;
}
