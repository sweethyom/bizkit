// settings/model/types.ts
export interface ProjectSettings {
  id: string;
  name: string;
  key?: string;
  image?: string | null;
  imageUrl?: string;
  leader?: boolean;
}

export interface TeamMember {
  id: string;
  userId?: string;
  nickname: string;
  email: string;
  profileImage?: string;
  leader: boolean;
}

export interface InvitedMember {
  invitationCode: string; // API 명세와 일치하도록 변경 (invitationId -> invitationCode)
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
