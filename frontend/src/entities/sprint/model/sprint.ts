export enum SprintStatus {
  READY = 'READY',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
}

export interface Sprint {
  id: number;
  name: string;
  sprintStatus: SprintStatus;
  startDate: string;
  dueDate: string;
  completedDate: string | null;
  cntRemainIssues?: number;
}
