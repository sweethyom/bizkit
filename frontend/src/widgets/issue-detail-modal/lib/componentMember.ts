import { useCallback } from 'react';
import { getComponentList, getMemberList } from '../api/componentMemberApi';
import { useComponentStore, useMemberStore } from './componentMemberStore';

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

export const useMember = (projectId: number) => {
  const { members, setMembers } = useMemberStore();

  const getMembers = useCallback(async () => {
    const response = await getMemberList(projectId);
    setMembers(response.data);
  }, [projectId, setMembers]);

  return { members, getMembers };
};
