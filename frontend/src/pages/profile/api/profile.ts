// profile/api/profile.ts
import axios from 'axios';
import { UserProfile } from '@/pages/profile/model/types';

// Mock data 사용 여부 설정
const USE_MOCK_DATA = true;

/**
 * 사용자 프로필 조회
 * @param userId 사용자 ID
 */
export const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
  if (USE_MOCK_DATA) {
    // Mock 데이터 반환
    return getMockUserProfile(userId);
  }

  try {
    // 실제 API 호출
    const response = await axios.get('/users/me');

    if (response.data.result === 'SUCCESS') {
      const { id, email, nickname, profileImageUrl } = response.data.data;

      // API 응답 형식을 내부 모델 형식으로 변환
      return {
        id: id.toString(),
        name: nickname,
        email: email,
        profileImage: profileImageUrl,
        role: '개발자', // API에서 제공하지 않는 정보는 기본값 설정
        projects: [],
        activities: [],
        skills: [],
      };
    } else {
      throw new Error('Failed to fetch user profile');
    }
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
};

/**
 * 사용자 프로필 업데이트
 * @param userId 사용자 ID
 * @param profileData 업데이트할 프로필 데이터
 */
export const updateUserProfile = async (
  userId: string,
  profileData: Partial<UserProfile>,
): Promise<UserProfile> => {
  if (USE_MOCK_DATA) {
    // Mock 업데이트 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      ...getMockUserProfile(userId),
      ...profileData,
    };
  }

  try {
    // 닉네임 업데이트
    if (profileData.name) {
      await axios.patch('/users/nickname', {
        nickname: profileData.name,
      });
    }

    // 프로필 이미지 업데이트 (multipart/form-data)
    if (profileData.profileImage && profileData.profileImage.startsWith('data:')) {
      // Base64 이미지 데이터를 File 객체로 변환
      const formData = new FormData();
      const blob = await fetch(profileData.profileImage).then((r) => r.blob());
      const file = new File([blob], 'profile-image.jpg', { type: 'image/jpeg' });
      formData.append('profileImage', file);

      await axios.patch('/users/profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }

    // 업데이트된 사용자 정보 반환
    return fetchUserProfile(userId);
  } catch (error) {
    console.error('Failed to update user profile:', error);
    throw error;
  }
};

/**
 * 비밀번호 변경
 * @param oldPassword 기존 비밀번호
 * @param newPassword 새 비밀번호
 */
export const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
  if (USE_MOCK_DATA) {
    // Mock 업데이트 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return;
  }

  try {
    const response = await axios.patch('/users/password', {
      oldPassword,
      newPassword,
    });

    if (response.data.result !== 'SUCCESS') {
      throw new Error('Failed to change password');
    }
  } catch (error) {
    console.error('Failed to change password:', error);
    throw error;
  }
};

/**
 * Mock 사용자 프로필 데이터 생성
 * @param userId 사용자 ID
 */
const getMockUserProfile = (userId: string): UserProfile => {
  return {
    id: userId,
    name: '김개발',
    email: 'dev.kim@example.com',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    role: '프론트엔드 개발자',
    department: '개발팀',
    position: '주니어 개발자',
    bio: '사용자 경험을 향상시키는 프론트엔드 개발자입니다.',
    projects: [
      { id: 'p1', name: 'BIZKIT', role: '프론트엔드 개발자', tasksCount: 12 },
      { id: 'p2', name: '인사관리 시스템', role: '백엔드 개발자', tasksCount: 8 },
      { id: 'p3', name: '모바일 앱', role: '풀스택 개발자', tasksCount: 0 },
    ],
    activities: [
      {
        id: 'a1',
        type: 'task',
        projectId: 'p1',
        projectName: 'BIZKIT',
        content: '프로필 페이지 UI 개선',
        date: '2025-05-10',
        status: 'in_progress',
        priority: 'high',
      },
      {
        id: 'a2',
        type: 'comment',
        projectId: 'p1',
        projectName: 'BIZKIT',
        content: '로그인 화면 디자인 리뷰 진행',
        date: '2025-05-09',
      },
      {
        id: 'a3',
        type: 'update',
        projectId: 'p2',
        projectName: '인사관리 시스템',
        content: 'API 엔드포인트 문서화 완료',
        date: '2025-05-08',
        status: 'done',
      },
    ],
    skills: ['React', 'TypeScript', 'TailwindCSS', 'Node.js'],
  };
};
