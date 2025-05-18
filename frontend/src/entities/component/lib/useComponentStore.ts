import { Component } from '@/entities/component';
import { create } from 'zustand';

interface ComponentStore {
  components: Component[];
  setComponents: (componentList: Component[]) => void;
}

export const useComponentStore = create<ComponentStore>((set) => ({
  components: [],
  setComponents: (components: Component[]) => set({ components: components }),
}));
