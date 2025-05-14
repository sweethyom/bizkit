export interface Issue {
  id: string;
  key: string;
  title: string;
  epic: string;
  component: string;
  assignee: string;
  storyPoints: number;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'inProgress' | 'done';
  description?: string; // 이슈 상세 내용
  sprint?: string; // 스프린트 정보
}

export interface IssueDetailModalProps {
  isOpen: boolean;
  issue: Issue | null;
  onClose: () => void;
  onDelete?: (issueId: string) => void;
  onUpdate?: (issue: Issue) => void;
}

export interface ComponentGroup {
  id: string;
  name: string;
  issues: Issue[];
  isExpanded: boolean;
}

export interface StatusGroup {
  id: string;
  status: 'todo' | 'inProgress' | 'done';
  title: string;
  componentGroups: ComponentGroup[];
}

export interface SprintData {
  statusGroups: StatusGroup[];
}