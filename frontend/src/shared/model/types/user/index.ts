export interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  avatarUrl?: string | null;
}

// API 응답 타입
export interface UserProfileResponse {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl?: string | null;
}
