import { create } from 'zustand';
import { Member } from '../model/member';

interface MemberStore {
  members: Member[];
  setMembers: (members: Member[]) => void;
}

export const useMemberStore = create<MemberStore>((set) => ({
  members: [],
  setMembers: (members) => set({ members }),
}));
