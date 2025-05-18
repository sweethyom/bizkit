import { getEpicList } from '@/entities/epic/api/epicApi';
import { useEpicStore } from '@/entities/epic/lib/useEpicStore';
import { useCallback, useState } from 'react';

export const useEpic = (projectId: number) => {
  const { epics, setEpics } = useEpicStore();
  const [isLoading, setIsLoading] = useState(true);

  const getEpics = useCallback(async () => {
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

  const onDeleteIssue = (epicId: number) => {
    setEpics(
      epics.map((epic) => {
        if (epic.id === epicId) {
          return {
            ...epic,
            cntTotalIssues: epic.cntTotalIssues - 1,
            cntRemainIssues: epic.cntRemainIssues - 1,
          };
        }

        return epic;
      }),
    );
  };

  return { epics, getEpics, isLoading, onDeleteIssue };
};
