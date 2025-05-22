import { useUserStore } from '@/shared/lib';

export const useUser = () => {
  const { user } = useUserStore();

  return { user };
};
