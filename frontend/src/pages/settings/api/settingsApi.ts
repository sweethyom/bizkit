// settings/api/settingsApi.ts
import { Component, InviteMember, ProjectSettings, TeamMember } from '@/pages/settings/model/types';
import { api, ApiResponse } from '@/shared/api';
import axios from 'axios';

// API 경로 상수
const API_PATHS = {
  PROJECT: (projectId: string) => `/projects/${projectId}`,
  MEMBERS: (projectId: string) => `/projects/${projectId}/members`,
  COMPONENTS: (projectId: string) => `/projects/${projectId}/components`,
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
    return response.data.data as ProjectSettings;
  } catch (error) {
    console.error('프로젝트 설정 업데이트 실패:', error);
    throw error;
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
    const response = await api.delete<ApiResponse<void>>(`/members/${memberId}`);
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
    const response = await api.post<ApiResponse<Component>>(
      API_PATHS.COMPONENTS(projectId),
      component,
    );
    console.log('컴포넌트 추가 응답:', response.data);
    return response.data.data as Component;
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
    // 실제 API 호출
    console.log('컴포넌트 수정 - 프로젝트 ID:', projectId, '컴포넌트 ID:', component.id);

    // API 명세에 맞게 필요한 필드만 전송
    const requestData = {
      name: component.name,
      content: component.content || ''
    };

    const response = await api.put<ApiResponse<{ id: number }>>(
      `/components/${component.id}`,
      requestData
    );

    console.log('컴포넌트 수정 응답:', response.data);

    // 응답 데이터와 기존 데이터를 결합하여 반환
    return {
      id: component.id,
      name: component.name,
      content: component.content
    };
  } catch (error) {
    console.error('컴포넌트 수정 실패:', error);
    throw error;
  }
};

// 컴포넌트 삭제
export const deleteComponent = async (projectId: string, componentId: number): Promise<boolean> => {
  try {
    // 실제 API 호출
    console.log('컴포넌트 삭제 - 프로젝트 ID:', projectId, '컴포넌트 ID:', componentId);
    // API 명세에 맞게 경로 수정
    const response = await api.delete<ApiResponse<void>>(`/components/${componentId}`);
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
      `/projects/${projectId}/members/invitation`,
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
    const response = await api.delete<ApiResponse<void>>(`/projects/${projectId}/members/me`);
    console.log('팀 나가기 응답:', response.data);
    return response.data.result === 'SUCCESS';
  } catch (error) {
    console.error('팀 나가기 실패:', error);
    throw error;
  }
};

// 초대 팀원 삭제
export const removeInvitedMember = async (invitationId: string): Promise<boolean> => {
  try {
    console.log('초대 팀원 삭제 - 초대 ID:', invitationId);
    const response = await api.delete<ApiResponse<void>>(`/members/invitation/${invitationId}`);
    console.log('초대 팀원 삭제 응답:', response.data);
    return response.data.result === 'SUCCESS';
  } catch (error) {
    console.error('초대 팀원 삭제 실패:', error);
    throw error;
  }
};

// 초대 수락
export const acceptInvitation = async (invitationId: string): Promise<boolean> => {
  try {
    console.log('초대 수락 - 초대 ID:', invitationId);
    const response = await api.post<ApiResponse<void>>(`/members/invitation/${invitationId}`);
    console.log('초대 수락 응답:', response.data);
    return response.data.result === 'SUCCESS';
  } catch (error) {
    console.error('초대 수락 실패:', error);
    throw error;
  }
};
