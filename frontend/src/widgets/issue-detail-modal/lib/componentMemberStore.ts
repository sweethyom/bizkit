import { create } from 'zustand';
import { Component, Member } from '../model/types';

export interface ComponentStore {
  components: Component[];
  setComponents: (componentList: Component[]) => void;
}

export const useComponentStore = create<ComponentStore>((set) => ({
  components: [],
  setComponents: (components: Component[]) => set({ components: components }),
}));

export interface MemberStore {
  members: Member[];
  setMembers: (members: Member[]) => void;
}

export const useMemberStore = create<MemberStore>((set) => ({
  members: [],
  setMembers: (members) => {
    return set({ members });
  },
}));
