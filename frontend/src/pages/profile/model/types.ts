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

// 프로필 이미지 업로드 API 관련 타입

// 프로필 이미지 업로드 요청 타입
// 명세에서는 multipart/form-data 형식으로 전송
// Content-Disposition: form-data; name=profileImage; filename=xxx.jpg
// 실제 코드에서는 FormData 객체를 사용하여 처리
export interface ProfileImageRequest {
  profileImage: File; // 업로드할 프로필 이미지 파일
}

// 프로필 이미지 업로드 API 응답
// API 명세에 따르면 응답은 단순히 {"result": "SUCCESS"} 형태
// 특별히 추가 데이터가 없음
export interface ProfileImageResponse {
  // 서버에서 프로필 이미지 URL을 반환하지 않음
  // 대신 다시 사용자 정보를 조회해야 함
}
