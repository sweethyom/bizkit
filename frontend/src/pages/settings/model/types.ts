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
}

export interface Component {
  id: string;
  name: string;
  description?: string;
}

export interface InviteMember {
  email: string;
}
