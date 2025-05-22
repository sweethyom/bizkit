export interface Component {
  id: number;
  name: string;
  content: string;
}

export interface Member {
  nickname: string;
  profileImage: string | null;
  userId: number;
}
