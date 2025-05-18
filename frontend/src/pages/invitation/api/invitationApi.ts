// invitation/api/invitationApi.ts
import { ProjectInvitation } from '@/pages/invitation/model/types';
import { api, ApiResponse } from '@/shared/api';
import axios from 'axios';

/**
 * 초대 아이디로 프로젝트 정보 조회
 * @param invitationId 프로젝트 초대 ID
 */
export const getInvitationProjectInfo = async (
  invitationId: string,
): Promise<ProjectInvitation> => {
  try {
    // API 명세에 맞게 요청 - 앞쪽 슬래시 제거
    const response = await api.get<ApiResponse<ProjectInvitation>>(
      `projects/invitation/${invitationId}`,
    );

    if (response.data.result === 'SUCCESS' && response.data.data) {
      return response.data.data;
    } else {
      throw new Error('프로젝트 정보를 불러오는데 실패했습니다.');
    }
  } catch (error) {
    console.error('Failed to fetch invitation project info:', error);

    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        throw new Error('초대 정보를 찾을 수 없습니다. 유효하지 않거나 만료된 초대 링크입니다.');
      } else if (error.response.status === 401) {
        throw new Error('인증이 필요합니다. 로그인 후 다시 시도해주세요.');
      }
    }

    throw new Error('프로젝트 정보를 불러오는데 실패했습니다.');
  }
};

/**
 * 초대 수락
 * @param invitationId 프로젝트 초대 ID
 */
export const acceptInvitation = async (invitationId: string): Promise<boolean> => {
  try {
    // API 명세에 맞게 요청 - 앞쪽 슬래시 제거
    const response = await api.post<ApiResponse<void>>(
      `members/invitation/${invitationId}`,
      {}, // 빈 객체 전송 (요청 본문 없음)
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // API 명세에 따라 명시적 설정
        },
      }
    );
    
    return response.data.result === 'SUCCESS';
  } catch (error) {
    console.error('Failed to accept invitation:', error);
    
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        throw new Error('초대 정보를 찾을 수 없습니다. 유효하지 않거나 만료된 초대 링크입니다.');
      } else if (error.response.status === 401) {
        throw new Error('인증이 필요합니다. 로그인 후 다시 시도해주세요.');
      } else if (error.response.status === 400) {
        throw new Error('이미 프로젝트에 참여한 멤버이거나 유효하지 않은 초대입니다.');
      }
    }
    
    throw new Error('초대 수락에 실패했습니다.');
  }
};
