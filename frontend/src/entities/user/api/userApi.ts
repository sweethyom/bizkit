import { tokenStorage, useUserStore } from '@/shared/lib';

export const signOut = () => {
  tokenStorage.remove();
  useUserStore.setState({
    user: null,
  });

  window.location.href = '/signin';
};
