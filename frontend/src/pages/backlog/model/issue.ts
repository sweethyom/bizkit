interface Epic {
  id: number;
  name: string;
  key: string;
}

export interface Issue {
  id: number;
  name: string;
  key: string;
  bizPoint: number;
  issueImportance: string;
  issueStatus: string;
  component: {
    id: number;
    name: string;
  };
  assignee: {
    id: number;
    nickname: string;
    profileImageUrl: string;
  };
  epic?: Epic;
}
