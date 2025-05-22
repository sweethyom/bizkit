import { getMemberList } from '@/entities/member';
import { useCallback } from 'react';
import { useMemberStore } from './useMemeberStore';

export const useMember = (projectId: number) => {
  const { members, setMembers } = useMemberStore();

  const getMembers = useCallback(async () => {
    const response = await getMemberList(projectId);
    setMembers(response.data);
  }, [projectId, setMembers]);

  return { members, getMembers };
};
