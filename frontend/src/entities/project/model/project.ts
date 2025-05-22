export type Project = {
  id: number;
  name: string;
  key: string;
  image: string | null;
  leader: boolean;
};

export type ProjectList = {
  id: number;
  name: string;
  todoCount: number;
  image: string | null;
}[];
