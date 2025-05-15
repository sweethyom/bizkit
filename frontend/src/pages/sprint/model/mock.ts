import { SprintData } from '@/pages/sprint/model/types';

export const mockSprintData: SprintData = {
  statusGroups: [
    {
      id: 'todo',
      status: 'todo',
      title: '해야 할 일',
      componentGroups: [
        {
          id: 'comp1',
          name: '컴포넌트 1',
          isExpanded: false,
          issues: [],
        },
        {
          id: 'comp2',
          name: '컴포넌트 2',
          isExpanded: true,
          issues: [
            {
              id: 'issue1',
              key: 'BIZ-101',
              title: '로그인 페이지 구현',
              epic: '사용자 인증',
              component: '컴포넌트 2',
              assignee: '홍길동',
              storyPoints: 3,
              priority: 'high',
              status: 'todo',
            },
            {
              id: 'issue2',
              key: 'BIZ-102',
              title: '회원가입 페이지 구현',
              epic: '사용자 인증',
              component: '컴포넌트 2',
              assignee: '홍길동',
              storyPoints: 5,
              priority: 'medium',
              status: 'todo',
            },
          ],
        },
        {
          id: 'comp3',
          name: '컴포넌트 3',
          isExpanded: true,
          issues: [
            {
              id: 'issue3',
              key: 'BIZ-103',
              title: '사용자 관리 UI 구현',
              epic: '사용자 관리',
              component: '컴포넌트 3',
              assignee: '김철수',
              storyPoints: 8,
              priority: 'low',
              status: 'todo',
            },
          ],
        },
      ],
    },
    {
      id: 'inProgress',
      status: 'inProgress',
      title: '진행 중',
      componentGroups: [
        {
          id: 'comp1',
          name: '컴포넌트 1',
          isExpanded: false,
          issues: [],
        },
        {
          id: 'comp2',
          name: '컴포넌트 2',
          isExpanded: true,
          issues: [
            {
              id: 'issue4',
              key: 'BIZ-104',
              title: '백엔드 API 연동',
              epic: '시스템 통합',
              component: '컴포넌트 2',
              assignee: '이영희',
              storyPoints: 5,
              priority: 'high',
              status: 'inProgress',
            },
          ],
        },
        {
          id: 'comp3',
          name: '컴포넌트 3',
          isExpanded: true,
          issues: [
            {
              id: 'issue5',
              key: 'BIZ-105',
              title: '데이터 테이블 구현',
              epic: '데이터 관리',
              component: '컴포넌트 3',
              assignee: '박지민',
              storyPoints: 13,
              priority: 'medium',
              status: 'inProgress',
            },
          ],
        },
      ],
    },
    {
      id: 'done',
      status: 'done',
      title: '완료',
      componentGroups: [
        {
          id: 'comp1',
          name: '컴포넌트 1',
          isExpanded: true,
          issues: [
            {
              id: 'issue6',
              key: 'BIZ-106',
              title: '프로젝트 셋업',
              epic: '개발 환경',
              component: '컴포넌트 1',
              assignee: '최준호',
              storyPoints: 2,
              priority: 'high',
              status: 'done',
            },
          ],
        },
        {
          id: 'comp2',
          name: '컴포넌트 2',
          isExpanded: false,
          issues: [],
        },
        {
          id: 'comp3',
          name: '컴포넌트 3',
          isExpanded: false,
          issues: [],
        },
      ],
    },
  ],
};
