import { projectApi } from '@/shared/api';
import { useProjectStore } from '@/shared/lib';
import { useCallback, useEffect, useState } from 'react';

export const useProjects = () => {
  const { projects, setProjects } = useProjectStore();
  const [error, setError] = useState('');

  const createProject = async (projectName: string, projectKey: string) => {
    const response = await projectApi.createProject(projectName, projectKey);
    if (response?.result === 'SUCCESS' && response.data) {
      const newProject = {
        id: response.data.id,
        name: projectName,
        key: projectKey,
        image: null,
        todoCount: 0,
      };

      setProjects([newProject, ...(projects || [])]);
    } else {
      setError(response?.data || '프로젝트 생성에 실패했습니다.');
    }
  };

  const getProjects = useCallback(async () => {
    const response = await projectApi.getMyProjectList();

    if (response?.result === 'SUCCESS') {
      setProjects(response.data || []);
    }
  }, [setProjects]);

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  return { projects, createProject, error, setError };
};
