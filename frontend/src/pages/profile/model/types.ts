// profile/model/types.ts
export interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  avatarUrl?: string | null;
}

export interface ProfileFormValues {
  nickname: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

// API 응답 타입

// 사용자 프로필 API 응답
export interface UserProfileResponse {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl?: string | null;
}

// 프로필 이미지 업로드 API 응답
export interface ProfileImageResponse {
  profileImageUrl: string;
}
