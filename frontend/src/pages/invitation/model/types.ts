// invitation/model/types.ts
export interface ProjectInvitation {
  id: number;
  name: string;
  image: string | null;
  leader: {
    id: number;
    nickname: string;
    image: string | null;
  };
}
