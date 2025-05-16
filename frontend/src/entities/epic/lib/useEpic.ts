import { getEpicList } from '@/entities/epic/api/epicApi';
import { useEpicStore } from '@/entities/epic/lib/useEpicStore';
import { useCallback, useEffect, useState } from 'react';

export const useEpic = (projectId: number) => {
  const { epics, setEpics } = useEpicStore();
  const [isLoading, setIsLoading] = useState(true);

  const loadEpics = useCallback(async () => {
    if (!Number.isInteger(projectId)) return;

    try {
      setIsLoading(true);
      const response = await getEpicList(projectId);
      setEpics(response?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, setEpics]);

  useEffect(() => {
    loadEpics();
  }, [loadEpics]);

  return { epics, isLoading };
};
