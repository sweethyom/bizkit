// settings/api/settingsApi.ts
import { Component, InviteMember, ProjectSettings, TeamMember } from '../model/types';

// API 경로 상수
const API_PATHS = {
  PROJECT: (projectId: string) => `/projects/${projectId}`,
  MEMBERS: (projectId: string) => `/projects/${projectId}/members`,
  COMPONENTS: (projectId: string) => `/projects/${projectId}/components`,
};

// 프로젝트 설정 가져오기
export const getProjectSettings = async (projectId: string): Promise<ProjectSettings> => {
  try {
    // 실제 API 연동 시 아래 코드 주석 해제
    // return await api.get<ProjectSettings>(API_PATHS.PROJECT(projectId));

    // 현재는 모킹 데이터 반환
    return await mockGetProjectSettings(projectId);
  } catch (error) {
    console.error('프로젝트 설정 가져오기 실패:', error);
    throw error;
  }
};

// 프로젝트 설정 업데이트
export const updateProjectSettings = async (
  settings: ProjectSettings,
): Promise<ProjectSettings> => {
  try {
    // 실제 API 연동 시 아래 코드 주석 해제
    // return await api.put<ProjectSettings>(API_PATHS.PROJECT(settings.id), settings);

    // 현재는 모킹 데이터 반환
    return await mockUpdateProjectSettings(settings);
  } catch (error) {
    console.error('프로젝트 설정 업데이트 실패:', error);
    throw error;
  }
};

// 프로젝트 삭제
export const deleteProject = async (projectId: string): Promise<boolean> => {
  try {
    // 실제 API 연동 시 아래 코드 주석 해제
    // await api.delete(API_PATHS.PROJECT(projectId));
    // return true;

    // 현재는 모킹 데이터 반환
    return await mockDeleteProject(projectId);
  } catch (error) {
    console.error('프로젝트 삭제 실패:', error);
    throw error;
  }
};

// 팀원 목록 가져오기
export const getTeamMembers = async (projectId: string): Promise<TeamMember[]> => {
  try {
    // 실제 API 연동 시 아래 코드 주석 해제
    // return await api.get<TeamMember[]>(API_PATHS.MEMBERS(projectId));

    // 현재는 모킹 데이터 반환
    return await mockGetTeamMembers(projectId);
  } catch (error) {
    console.error('팀원 목록 가져오기 실패:', error);
    throw error;
  }
};

// 팀원 초대
export const inviteTeamMember = async (
  projectId: string,
  member: InviteMember,
): Promise<boolean> => {
  try {
    // 실제 API 연동 시 아래 코드 주석 해제
    // await api.post(API_PATHS.MEMBERS(projectId), member);
    // return true;

    // 현재는 모킹 데이터 반환
    return await mockInviteTeamMember(projectId, member);
  } catch (error) {
    console.error('팀원 초대 실패:', error);
    throw error;
  }
};

// 팀원 삭제
export const removeTeamMember = async (projectId: string, memberId: string): Promise<boolean> => {
  try {
    // 실제 API 연동 시 아래 코드 주석 해제
    // await api.delete(`${API_PATHS.MEMBERS(projectId)}/${memberId}`);
    // return true;

    // 현재는 모킹 데이터 반환
    return await mockRemoveTeamMember(projectId, memberId);
  } catch (error) {
    console.error('팀원 삭제 실패:', error);
    throw error;
  }
};

// 컴포넌트 목록 가져오기
export const getComponents = async (projectId: string): Promise<Component[]> => {
  try {
    // 실제 API 연동 시 아래 코드 주석 해제
    // return await api.get<Component[]>(API_PATHS.COMPONENTS(projectId));

    // 현재는 모킹 데이터 반환
    return await mockGetComponents(projectId);
  } catch (error) {
    console.error('컴포넌트 목록 가져오기 실패:', error);
    throw error;
  }
};

// 컴포넌트 추가
export const addComponent = async (projectId: string, component: Component): Promise<Component> => {
  try {
    // 실제 API 연동 시 아래 코드 주석 해제
    // return await api.post<Component>(API_PATHS.COMPONENTS(projectId), component);

    // 현재는 모킹 데이터 반환
    return await mockAddComponent(projectId, component);
  } catch (error) {
    console.error('컴포넌트 추가 실패:', error);
    throw error;
  }
};

// 컴포넌트 수정
export const updateComponent = async (
  projectId: string,
  component: Component,
): Promise<Component> => {
  try {
    // 실제 API 연동 시 아래 코드 주석 해제
    // return await api.put<Component>(`${API_PATHS.COMPONENTS(projectId)}/${component.id}`, component);

    // 현재는 모킹 데이터 반환
    return await mockUpdateComponent(projectId, component);
  } catch (error) {
    console.error('컴포넌트 수정 실패:', error);
    throw error;
  }
};

// 컴포넌트 삭제
export const deleteComponent = async (projectId: string, componentId: string): Promise<boolean> => {
  try {
    // 실제 API 연동 시 아래 코드 주석 해제
    // await api.delete(`${API_PATHS.COMPONENTS(projectId)}/${componentId}`);
    // return true;

    // 현재는 모킹 데이터 반환
    return await mockDeleteComponent(projectId, componentId);
  } catch (error) {
    console.error('컴포넌트 삭제 실패:', error);
    throw error;
  }
};

// ==================== 모킹 함수 ====================

const mockGetProjectSettings = (projectId: string): Promise<ProjectSettings> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: projectId,
        name: '프로젝트 이름',
        imageUrl: 'https://via.placeholder.com/100',
      });
    }, 500);
  });
};

const mockUpdateProjectSettings = (settings: ProjectSettings): Promise<ProjectSettings> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(settings);
    }, 500);
  });
};

const mockDeleteProject = (projectId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

const mockGetTeamMembers = (projectId: string): Promise<TeamMember[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          nickname: '홍길동',
          email: 'hong@example.com',
          role: 'LEADER',
        },
        {
          id: '2',
          nickname: '김철수',
          email: 'kim@example.com',
          role: 'MEMBER',
        },
        {
          id: '3',
          nickname: '이영희',
          email: 'lee@example.com',
          role: 'MEMBER',
        },
      ]);
    }, 500);
  });
};

const mockInviteTeamMember = (projectId: string, member: InviteMember): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

const mockRemoveTeamMember = (projectId: string, memberId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

const mockGetComponents = (projectId: string): Promise<Component[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          name: '프론트엔드',
          description: '프론트엔드 관련 컴포넌트',
        },
        {
          id: '2',
          name: '백엔드',
          description: '백엔드 관련 컴포넌트',
        },
        {
          id: '3',
          name: '데이터베이스',
          description: '데이터베이스 관련 컴포넌트',
        },
      ]);
    }, 500);
  });
};

const mockAddComponent = (projectId: string, component: Component): Promise<Component> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: new Date().getTime().toString(),
        ...component,
      });
    }, 500);
  });
};

const mockUpdateComponent = (projectId: string, component: Component): Promise<Component> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(component);
    }, 500);
  });
};

const mockDeleteComponent = (projectId: string, componentId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};
