// profile/api/profile.ts
import {
  ProfileImageResponse,
  UserProfile,
  UserProfileResponse,
} from '@/pages/profile/model/types';
import { api, ApiResponse } from '@/shared/api';
import axios from 'axios';

// 개발용 Mock 모드 (실제 서버 연동이 되지 않을 때 사용)
// 이 부분은 필요에 따라 USE_MOCK_DATA = false로 변경하여 실제 API 호출 가능
const USE_MOCK_DATA = false;

// 실제 API 구현 함수들
const apiImplementations = {
  fetchUserProfile: async (): Promise<UserProfile> => {
    try {
      const response = await api.get<ApiResponse<UserProfileResponse>>('/users/me');

      if (response.data.result === 'SUCCESS' && response.data.data) {
        // 타입을 명시적으로 지정하여 오류 해결
        const userData = response.data.data as UserProfileResponse;
        const { id, email, nickname, profileImageUrl } = userData;

        return {
          id: id.toString(),
          email,
          nickname,
          avatarUrl: profileImageUrl,
        };
      } else {
        throw new Error('Failed to fetch user profile');
      }
    } catch (error: unknown) {
      console.error('Failed to fetch user profile:', error);
      throw error;
    }
  },

  /**
   * 닉네임 변경
   * PATCH /api/users/nickname
   */
  updateNickname: async (nickname: string): Promise<void> => {
    try {
      // API 명세서에 맞춰 요청
      const response = await api.patch<ApiResponse<void>>('/users/nickname', { nickname });

      if (response.data.result !== 'SUCCESS') {
        throw new Error('닉네임 변경에 실패했습니다');
      }
    } catch (error: unknown) {
      console.error('Failed to update nickname:', error);
      throw error;
    }
  },

  /**
   * 비밀번호 변경
   * PATCH /api/users/password
   */
  updatePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    try {
      // API 명세서에 맞춰 요청
      const response = await api.patch<ApiResponse<void>>('/users/password', {
        oldPassword,
        newPassword,
      });

      if (response.data.result !== 'SUCCESS') {
        throw new Error('비밀번호 변경에 실패했습니다');
      }
    } catch (error: unknown) {
      // 서버에서 오는 오류 메시지가 있다면 그것을 사용
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      console.error('Failed to update password:', error);
      throw error;
    }
  },

  /**
   * 프로필 이미지 업로드
   * PATCH /api/users/profile-image
   */
  uploadProfileImage: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('profileImage', file);

      // Content-Type을 설정하지 않고 axios가 자동으로 처리하도록 함
      const response = await api.patch<ApiResponse<ProfileImageResponse>>(
        '/users/profile-image',
        formData
        // Content-Type 헤더를 명시적으로 설정하지 않음
        // multipart/form-data 경계 문자열을 자동으로 설정하도록 함
      );

      if (response.data.result === 'SUCCESS' && response.data.data) {
        // 서버에서 이미지 URL을 바로 반환하는 경우
        const imageData = response.data.data as ProfileImageResponse;
        if (imageData.profileImageUrl) {
          return imageData.profileImageUrl;
        }

        // URL을 반환하지 않는 경우 사용자 정보를 다시 가져와야 함
        const profileResponse = await apiImplementations.fetchUserProfile();
        return profileResponse.avatarUrl || '';
      } else {
        throw new Error('Failed to upload profile image');
      }
    } catch (error: unknown) {
      console.error('Failed to upload profile image:', error);
      throw error;
    }
  },
};

// Mock 구현 함수들
const mockImplementations = {
  /**
   * Mock 버전: 사용자 프로필 조회
   */
  fetchUserProfile: async (): Promise<UserProfile> => {
    // 로딩 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      id: '1',
      email: 'user@example.com',
      nickname: '홍길동',
      avatarUrl: null,
    };
  },

  /**
   * Mock 버전: 닉네임 변경
   */
  updateNickname: async (nickname: string): Promise<void> => {
    if (!nickname.trim() || nickname.length < 2 || nickname.length > 6) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      throw new Error('닉네임은 2~6자리여야 합니다');
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  },

  /**
   * Mock 버전: 비밀번호 변경
   */
  updatePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    if (!oldPassword) {
      throw new Error('현재 비밀번호를 입력해주세요');
    }

    if (!newPassword) {
      throw new Error('새 비밀번호를 입력해주세요');
    }

    // 비밀번호 제약 조건 검사
    if (newPassword.length < 8) {
      throw new Error('비밀번호는 8자 이상이어야 합니다');
    }

    // Mock에서는 'password'를 현재 비밀번호로 가정
    if (oldPassword !== 'password') {
      await new Promise((resolve) => setTimeout(resolve, 500));
      throw new Error('현재 비밀번호가 일치하지 않습니다');
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  },

  /**
   * Mock 버전: 프로필 이미지 업로드
   */
  uploadProfileImage: async (file: File): Promise<string> => {
    if (!file.type.startsWith('image/')) {
      throw new Error('이미지 파일만 업로드 가능합니다');
    }

    if (file.size > 3 * 1024 * 1024) {
      throw new Error('이미지 크기는 3MB 이하여야 합니다');
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 임시 이미지 URL 반환
    return URL.createObjectURL(file);
  },
};

// 실제 내보낼 함수들 (모드에 따라 구현이 달라짐)
export const fetchUserProfile = async (): Promise<UserProfile> => {
  if (USE_MOCK_DATA) {
    console.log('🧪 Mock 모드: fetchUserProfile');
    return mockImplementations.fetchUserProfile();
  } else {
    return apiImplementations.fetchUserProfile();
  }
};

export const updateNickname = async (nickname: string): Promise<void> => {
  if (USE_MOCK_DATA) {
    console.log('🧪 Mock 모드: updateNickname');
    return mockImplementations.updateNickname(nickname);
  } else {
    return apiImplementations.updateNickname(nickname);
  }
};

export const updatePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
  if (USE_MOCK_DATA) {
    console.log('🧪 Mock 모드: updatePassword');
    return mockImplementations.updatePassword(oldPassword, newPassword);
  } else {
    return apiImplementations.updatePassword(oldPassword, newPassword);
  }
};

export const uploadProfileImage = async (file: File): Promise<string> => {
  if (USE_MOCK_DATA) {
    console.log('🧪 Mock 모드: uploadProfileImage');
    return mockImplementations.uploadProfileImage(file);
  } else {
    return apiImplementations.uploadProfileImage(file);
  }
};

// 개발 모드 안내
if (USE_MOCK_DATA) {
  console.log('====================================');
  console.log('🧪 개발 모드: 서버 없이 Mock 데이터 사용 중');
  console.log('비밀번호 변경 테스트 시 현재 비밀번호는 "password"입니다.');
  console.log('====================================');
}
