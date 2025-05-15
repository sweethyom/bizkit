// settings/model/types.ts
export interface ProjectSettings {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface TeamMember {
  id: string;
  nickname: string;
  email: string;
  role: 'LEADER' | 'MEMBER';
  profileImage?: string;
  leader?: boolean; // API 응답과 호환을 위해 추가
}

export interface InvitedMember {
  invitationId: string;
  id: string;
  nickname: string;
  email: string;
  profileImage?: string;
}

export interface Component {
  id: string;
  name: string;
  content?: string;
}

export interface InviteMember {
  email: string;
}

export interface InvitationResponse {
  invitationId: string;
}
