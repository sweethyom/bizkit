// profile/api/profile.ts
import { UserProfile, UserProfileResponse } from '@/pages/profile/model/types';
import { api, ApiResponse } from '@/shared/api';
import axios from 'axios';

// 개발용 Mock 모드 (실제 서버 연동이 되지 않을 때 사용)
// 이 부분은 필요에 따라 USE_MOCK_DATA = false로 변경하여 실제 API 호출 가능
const USE_MOCK_DATA = false;

// 실제 API 구현 함수들
const apiImplementations = {
  fetchUserProfile: async (): Promise<UserProfile> => {
    try {
      const response = await api.get<ApiResponse<UserProfileResponse>>('users/me');

      if (response.data.result === 'SUCCESS' && response.data.data) {
        // 타입을 명시적으로 지정하여 오류 해결
        const userData = response.data.data as UserProfileResponse;
        const { id, email, nickname, profileImageUrl } = userData;

        return {
          id: id.toString(),
          email,
          nickname,
          profileImageUrl: profileImageUrl || null,
          avatarUrl: profileImageUrl || null,
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
      const response = await api.patch<ApiResponse<void>>('users/nickname', { nickname });

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
      const response = await api.patch<ApiResponse<void>>('users/password', {
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
   * API 명세: 프로필 이미지를 multipart/form-data 형식으로 업로드
   */
  uploadProfileImage: async (file: File): Promise<string> => {
    try {
      // ProfileImageRequest 타입에 맞게 FormData 생성
      const formData = new FormData();
      formData.append('profileImage', file); // API 명세에 지정된 파라미터 이름 'profileImage' 사용

      // API 명세에서는 Content-Type을 application/x-www-form-urlencoded로 지정했지만
      // 파일 업로드의 경우 multipart/form-data를 사용해야 함
      // axios가 FormData 객체를 감지하면 자동으로 multipart/form-data로 설정
      const response = await api.patch<ApiResponse<void>>(
        'users/profile-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
        // Content-Type 헤더를 명시적으로 설정하지 않는 것이 좋음
        // axios가 알아서 boundary 정보를 포함한 multipart/form-data 헤더를 만들어줌
      );

      if (response.data.result === 'SUCCESS') {
        // API 명세에 따르면 응답에 이미지 URL이 포함되지 않음
        // 프로필 이미지 URL을 얻기 위해 사용자 정보를 다시 조회해야 함
        const profileResponse = await apiImplementations.fetchUserProfile();
        return profileResponse.avatarUrl || '';
      } else {
        // 오류 응답일 경우 서버에서 제공한 오류 메시지 포함
        console.error('Server response error:', response.data);

        // 서버에서 오류 메시지를 제공하는 경우 해당 메시지 사용
        if (response.data.error && typeof response.data.error === 'object') {
          // 서버 오류 객체의 형식에 따라 적절히 처리
          const errorObj = response.data.error;
          if (errorObj.message) {
            throw new Error(errorObj.message);
          } else if (errorObj.code) {
            throw new Error(`Error code: ${errorObj.code}`);
          }
        }

        throw new Error('Failed to upload profile image: Server returned an error');
      }
    } catch (error: unknown) {
      console.error('Failed to upload profile image:', error);

      // AxiosError의 경우 서버 응답 데이터에서 오류 정보 추출
      if (axios.isAxiosError(error) && error.response) {
        console.error('Server error response:', error.response.data);

        // 서버에서 오류 데이터를 제공하는 경우
        if (error.response.data && error.response.data.error) {
          const serverError = error.response.data.error;
          if (typeof serverError === 'object' && serverError.message) {
            throw new Error(serverError.message);
          } else if (typeof serverError === 'string') {
            throw new Error(serverError);
          }
        }

        // HTTP 상태 코드에 따른 오류 메시지
        if (error.response.status === 413) {
          throw new Error('이미지 파일이 너무 큽니다. 더 작은 파일을 업로드해 주세요.');
        } else if (error.response.status === 415) {
          throw new Error('지원되지 않는 파일 형식입니다. 이미지 파일만 업로드 가능합니다.');
        } else if (error.response.status === 400) {
          throw new Error('잘못된 요청입니다. 이미지 파일을 올바르게 선택해 주세요.');
        } else if (error.response.status === 500) {
          throw new Error('서버 오류가 발생했습니다. 다시 시도하거나 관리자에게 문의해 주세요.');
        }
      }

      // 기본 오류 메시지 처리
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('이미지 업로드 중 알 수 없는 오류가 발생했습니다.');
      }
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
