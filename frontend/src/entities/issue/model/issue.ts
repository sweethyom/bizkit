export type IssueStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'UNASSIGNED';
export type IssueImportance = 'HIGH' | 'LOW';

interface Epic {
  id: number;
  name: string;
  key: string;
}

export interface Issue {
  id: number;
  name: string;
  content?: string;
  key: string;
  bizPoint?: number;
  issueImportance: string;
  issueStatus: IssueStatus;
  project?: {
    id: number;
    name: string;
  };
  component?: {
    id: number;
    name: string;
  };
  assignee?: {
    id: number;
    nickname: string;
    profileImageUrl: string | null;
  };
  epic?: Epic;
}
