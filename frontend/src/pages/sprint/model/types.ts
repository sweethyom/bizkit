export interface Assignee {
  id: string | number;
  nickname: string;
  profileImageUrl?: string | null;
}

export interface Issue {
  id: string;
  key: string;
  title: string;
  epic: string;
  component: string;
  assignee: string | Assignee | null; // 문자열 또는 객체 또는 null
  storyPoints: number;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'inProgress' | 'done';
  description?: string; // 이슈 상세 내용
  sprint?: string; // 스프린트 정보
  position?: number | null; // 이슈의 순서 값 (null 허용)
}

// GET /components/{componentId}/issues API 응답을 위한 인터페이스
export interface ComponentIssueGroup {
  issueStatus: string; // 'TODO', 'IN_PROGRESS', 'DONE'
  issues: Issue[];
}

export interface IssueDetailModalProps {
  isOpen: boolean;
  issue: Issue | null;
  projectId: string; // 프로젝트 ID 추가
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
  sprintId: string | null; // null 허용 추가
  statusGroups: StatusGroup[];
}
