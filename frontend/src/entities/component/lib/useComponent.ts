import { getComponentList, useComponentStore } from '@/entities/component';

import { useCallback } from 'react';

export const useComponent = (projectId: number) => {
  const { components, setComponents: setComponentList } = useComponentStore();

  const getComponents = useCallback(async () => {
    if (!projectId) return;

    try {
      const response = await getComponentList(projectId);
      setComponentList(response.data || []);
    } catch (error) {
      console.error(error);
    }
  }, [projectId, setComponentList]);

  return { components, getComponents };
};
