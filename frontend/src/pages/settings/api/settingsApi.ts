// settings/api/settingsApi.ts
import { Component, InviteMember, ProjectSettings, TeamMember } from '@/pages/settings/model/types';
import { api, ApiResponse } from '@/shared/api';
import axios from 'axios';

// API 경로 상수
const API_PATHS = {
  PROJECT: (projectId: string) => `projects/${projectId}`,
  MEMBERS: (projectId: string) => `projects/${projectId}/members`,
  COMPONENTS: (projectId: string) => `projects/${projectId}/components`,
};

// 프로젝트 설정 가져오기
export const getProjectSettings = async (projectId: string): Promise<ProjectSettings> => {
  try {
    // 실제 API 호출
    const response = await api.get<ApiResponse<ProjectSettings>>(API_PATHS.PROJECT(projectId));
    console.log('프로젝트 설정 가져오기 응답:', response.data);
    return response.data.data as ProjectSettings;
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
    // 실제 API 호출
    const response = await api.patch<ApiResponse<ProjectSettings>>(
      API_PATHS.PROJECT(settings.id),
      settings,
    );
    console.log('프로젝트 설정 업데이트 응답:', response.data);
    
    // 서버 응답에 데이터가 없는 경우 처리
    if (response.data.result === 'SUCCESS') {
      if (response.data.data) {
        return response.data.data as ProjectSettings;
      } else {
        // 서버가 데이터를 반환하지 않은 경우, 원본 설정을 반환
        console.log('서버가 데이터를 반환하지 않았지만 성공했으니 원본 설정을 반환합니다.');
        return settings;
      }
    } else {
      throw new Error('프로젝트 설정 업데이트 실패');
    }
  } catch (error) {
    console.error('프로젝트 설정 업데이트 실패:', error);
    throw error;
  }
};

// 프로젝트 이미지 업데이트
export const updateProjectImage = async (
  projectId: string,
  imageFile: File,
): Promise<boolean> => {
  try {
    console.log('프로젝트 이미지 업데이트 - 프로젝트 ID:', projectId);
    console.log('업로드할 파일 정보:', imageFile.name, imageFile.type, imageFile.size);
    
    // 멀티파트 폼데이터 생성
    const formData = new FormData();
    formData.append('projectImage', imageFile);
    
    // 명시적으로 Content-Type 헤더를 설정
    // 프로필 이미지 업로드 함수와 동일한 방식으로 구현
    const response = await api.patch<ApiResponse<void>>(
      `${API_PATHS.PROJECT(projectId)}/image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    console.log('프로젝트 이미지 업데이트 응답:', response.data);
    return response.data.result === 'SUCCESS';
  } catch (error) {
    console.error('프로젝트 이미지 업데이트 실패:', error);
    
    // Axios 오류인 경우 더 자세한 정보 출력 및 사용자 친화적인 에러 메시지 제공
    if (axios.isAxiosError(error)) {
      console.error('요청 URL:', error.config?.url);
      console.error('요청 방식:', error.config?.method);
      console.error('요청 헤더:', error.config?.headers);
      console.error('응답 상태:', error.response?.status);
      console.error('응답 데이터:', error.response?.data);
      
      // 서버 측 오류 메시지가 있다면 출력
      if (error.response?.data?.error?.message) {
        console.error('서버 오류 메시지:', error.response.data.error.message);
      }
      
      // HTTP 상태 코드에 따른 오류 메시지
      if (error.response?.status === 413) {
        throw new Error('이미지 파일이 너무 큽니다. 더 작은 파일을 업로드해 주세요.');
      } else if (error.response?.status === 415) {
        throw new Error('지원되지 않는 파일 형식입니다. 이미지 파일만 업로드 가능합니다.');
      } else if (error.response?.status === 400) {
        throw new Error('잘못된 요청입니다. 이미지 파일을 올바르게 선택해 주세요.');
      } else if (error.response?.status === 500) {
        throw new Error('서버 오류가 발생했습니다. 이미지 업로드 기능이 서버에서 완전히 구현되지 않았을 수 있습니다.');
      }
    }
    
    // 기본 오류 메시지 처리
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('이미지 업로드 중 알 수 없는 오류가 발생했습니다.');
    }
  }
};

// 프로젝트 삭제
export const deleteProject = async (projectId: string): Promise<boolean> => {
  try {
    // 실제 API 호출
    const response = await api.delete<ApiResponse<void>>(API_PATHS.PROJECT(projectId));
    console.log('프로젝트 삭제 응답:', response.data);
    return response.data.result === 'SUCCESS';
  } catch (error) {
    console.error('프로젝트 삭제 실패:', error);
    throw error;
  }
};

// 팀원 목록 가져오기
export const getTeamMembers = async (projectId: string): Promise<TeamMember[]> => {
  try {
    // 실제 API 호출
    console.log('팀원 목록 가져오기 - 프로젝트 ID:', projectId);
    const response = await api.get<ApiResponse<TeamMember[]>>(API_PATHS.MEMBERS(projectId));
    console.log('팀원 목록 가져오기 응답:', response.data);
    return response.data.data || [];
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
    // 실제 API 연동
    console.log('초대할 이메일:', member.email);
    console.log('프로젝트 ID:', projectId);

    // API 명세서에 맞게 수정
    const response = await api.post(API_PATHS.MEMBERS(projectId), { email: member.email });

    // 응답 데이터 상세 로깅
    console.log('팀원 초대 응답 전체:', response);
    console.log('팀원 초대 응답 데이터:', response.data);
    console.log('팀원 초대 응답 상태 코드:', response.status);

    // 성공 여부 확인
    if (response.status === 200 && response.data && response.data.result === 'SUCCESS') {
      return true;
    } else {
      console.error('팀원 초대 응답이 성공이 아님:', response.data);
      return false;
    }
  } catch (error) {
    console.error('팀원 초대 실패:', error);

    // 엑시오스 오류인 경우 더 자세한 정보 출력
    if (axios.isAxiosError(error)) {
      console.error('요청 URL:', error.config?.url);
      console.error('요청 방식:', error.config?.method);
      console.error('요청 헤더:', error.config?.headers);
      console.error('요청 본문:', error.config?.data);
      console.error('응답 상태:', error.response?.status);
      console.error('응답 데이터:', error.response?.data);
    }

    throw error;
  }
};

// 팀원 삭제
export const removeTeamMember = async (projectId: string, memberId: string): Promise<boolean> => {
  try {
    // 실제 API 호출
    console.log('팀원 삭제 - 팀원 ID:', memberId);
    // API 명세서에 따라 수정한 경로
    const response = await api.delete<ApiResponse<void>>(`members/${memberId}`);
    console.log('팀원 삭제 응답:', response.data);
    return response.data.result === 'SUCCESS';
  } catch (error) {
    console.error('팀원 삭제 실패:', error);
    throw error;
  }
};

// 컴포넌트 목록 가져오기
export const getComponents = async (projectId: string): Promise<Component[]> => {
  try {
    // 실제 API 호출
    console.log('컴포넌트 목록 가져오기 - 프로젝트 ID:', projectId);
    const response = await api.get<ApiResponse<Component[]>>(API_PATHS.COMPONENTS(projectId));
    console.log('컴포넌트 목록 가져오기 응답:', response.data);
    return response.data.data || [];
  } catch (error) {
    console.error('컴포넌트 목록 가져오기 실패:', error);
    throw error;
  }
};

// 컴포넌트 추가
export const addComponent = async (projectId: string, component: Component): Promise<Component> => {
  try {
    // 실제 API 호출
    console.log('컴포넌트 추가 - 프로젝트 ID:', projectId, '컴포넌트:', component);
    
    // API 명세에 맞게 필요한 필드만 전송
    const requestData = {
      name: component.name,
      content: component.content || '',
    };
    
    const response = await api.post<ApiResponse<{ id: number }>>(
      API_PATHS.COMPONENTS(projectId),
      requestData,
    );
    console.log('컴포넌트 추가 응답:', response.data);
    
    // API 명세에 따라 ID만 받아 객체 구성
    if (response.data.result === 'SUCCESS' && response.data.data) {
      return {
        id: response.data.data.id,
        name: component.name,
        content: component.content || '',
      };
    } else {
      throw new Error('컴포넌트 추가 실패');
    }
  } catch (error) {
    console.error('컴포넌트 추가 실패:', error);
    throw error;
  }
};

// 컴포넌트 수정 - 이름과 설명 수정이 분리됨
export const updateComponentName = async (componentId: number, name: string): Promise<number> => {
  try {
    // 실제 API 호출
    console.log('컴포넌트 이름 수정 - 컴포넌트 ID:', componentId, '새 이름:', name);

    // API 명세에 맞게 이름만 전송
    const requestData = { name: name.trim() };
    
    const response = await api.put<ApiResponse<{ id: number }>>(
      `components/${componentId}/name`,
      requestData,
    );

    console.log('컴포넌트 이름 수정 응답:', response.data);

    if (response.data.result === 'SUCCESS') {
      return response.data.data?.id || componentId;
    } else {
      throw new Error('컴포넌트 이름 수정 실패');
    }
  } catch (error) {
    console.error('컴포넌트 이름 수정 실패:', error);
    throw error;
  }
};

// 컴포넌트 설명 수정
export const updateComponentContent = async (componentId: number, content: string): Promise<number> => {
  try {
    // 실제 API 호출
    console.log('컴포넌트 설명 수정 - 컴포넌트 ID:', componentId, '새 설명:', content);

    // API 명세에 맞게 설명만 전송
    const requestData = { content: content.trim() };
    
    const response = await api.put<ApiResponse<{ id: number }>>(
      `components/${componentId}/content`,
      requestData,
    );

    console.log('컴포넌트 설명 수정 응답:', response.data);

    if (response.data.result === 'SUCCESS') {
      return response.data.data?.id || componentId;
    } else {
      throw new Error('컴포넌트 설명 수정 실패');
    }
  } catch (error) {
    console.error('컴포넌트 설명 수정 실패:', error);
    throw error;
  }
};

// 컴포넌트 수정 (이름과 설명 모두 수정 - 피선하지 않은 경우 이전 함수가 구현한 기능)
export const updateComponent = async (component: Component): Promise<Component> => {
  try {
    console.log('컴포넌트 전체 수정:', component);
    
    // 컴포넌트 ID 받아오기
    const componentId = typeof component.id === 'string' ? parseInt(component.id) : component.id;
    
    // 이름과 설명 모두 변경
    let updatedId = componentId;
    
    // 이름 변경
    updatedId = await updateComponentName(componentId, component.name);
    
    // 설명 변경 (공백이 아닐 때만)
    if (component.content !== undefined) {
      updatedId = await updateComponentContent(componentId, component.content || '');
    }
    
    // 결과 객체 구성
    return {
      id: String(updatedId),
      name: component.name,
      content: component.content,
    };
  } catch (error) {
    console.error('컴포넌트 수정 실패:', error);
    throw error;
  }
};

// 컴포넌트 삭제
export const deleteComponent = async (componentId: number): Promise<boolean> => {
  try {
    // 실제 API 호출
    console.log('컴포넌트 삭제 - 컴포넌트 ID:', componentId);
    // API 명세에 맞게 경로 수정
    const response = await api.delete<ApiResponse<void>>(`components/${componentId}`);
    console.log('컴포넌트 삭제 응답:', response.data);
    return response.data.result === 'SUCCESS';
  } catch (error) {
    console.error('컴포넌트 삭제 실패:', error);
    throw error;
  }
};

// ==================== 멤버 관련 API ====================

// 초대 팀원 목록 조회
export const getInvitedMembers = async (projectId: string): Promise<InvitedMember[]> => {
  try {
    console.log('초대 팀원 목록 가져오기 - 프로젝트 ID:', projectId);
    const response = await api.get<ApiResponse<InvitedMember[]>>(
      `projects/${projectId}/members/invitation`,
    );
    console.log('초대 팀원 목록 가져오기 응답:', response.data);
    return response.data.data || [];
  } catch (error) {
    console.error('초대 팀원 목록 가져오기 실패:', error);
    throw error;
  }
};

// 팀 나가기
export const leaveTeam = async (projectId: string): Promise<boolean> => {
  try {
    console.log('팀 나가기 - 프로젝트 ID:', projectId);
    const response = await api.delete<ApiResponse<void>>(`projects/${projectId}/members/me`);
    console.log('팀 나가기 응답:', response.data);
    return response.data.result === 'SUCCESS';
  } catch (error) {
    console.error('팀 나가기 실패:', error);
    throw error;
  }
};

// 초대 팀원 삭제
export const removeInvitedMember = async (invitationCode: string): Promise<boolean> => {
  try {
    // invitationCode 유효성 검사
    if (!invitationCode) {
      console.error('유효하지 않은 초대 코드:', invitationCode);
      throw new Error('유효하지 않은 초대 코드가 전달되었습니다.');
    }
    
    console.log('초대 팀원 삭제 - 초대 코드:', invitationCode);
    const response = await api.delete<ApiResponse<void>>(`members/invitation/${invitationCode}`);
    console.log('초대 팀원 삭제 응답:', response.data);
    return response.data.result === 'SUCCESS';
  } catch (error) {
    console.error('초대 팀원 삭제 실패:', error);
    
    // 엑시오스 오류인 경우 더 자세한 정보 출력
    if (axios.isAxiosError(error)) {
      console.error('요청 URL:', error.config?.url);
      console.error('요청 방식:', error.config?.method);
      console.error('응답 상태:', error.response?.status);
      console.error('응답 데이터:', error.response?.data);
    }
    
    throw error;
  }
};

// 초대 수락
export const acceptInvitation = async (invitationCode: string): Promise<boolean> => {
  try {
    console.log('초대 수락 - 초대 코드:', invitationCode);
    const response = await api.post<ApiResponse<void>>(`members/invitation/${invitationCode}`);
    console.log('초대 수락 응답:', response.data);
    return response.data.result === 'SUCCESS';
  } catch (error) {
    console.error('초대 수락 실패:', error);
    throw error;
  }
};
