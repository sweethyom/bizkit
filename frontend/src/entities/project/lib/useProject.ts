import { getProjectList } from '@/entities/project/api/projectApi';

import { useProjectStore } from './useProjectStore';

import { useCallback, useEffect, useState } from 'react';

export const useProject = () => {
  const { projects, setProjects } = useProjectStore();
  const [error, setError] = useState('');

  const getProjects = useCallback(async () => {
    const response = await getProjectList();

    if (response?.result === 'SUCCESS') {
      setProjects(response.data || []);
    }
  }, [setProjects]);

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  return { projects, error, setError };
};
