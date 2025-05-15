import { api, ApiResponse } from '@/shared/api';
import { UserProfile, UserProfileResponse } from '@/shared/model/types/user';

/**
 * 사용자 프로필 정보를 가져오는 API
 * GET /api/users/me
 */
export const fetchUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await api.get<ApiResponse<UserProfileResponse>>('/users/me');

    if (response.data.result === 'SUCCESS' && response.data.data) {
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
};
