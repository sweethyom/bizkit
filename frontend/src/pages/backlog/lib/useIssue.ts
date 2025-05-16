import { getIssueList } from '@/pages/backlog/api/issueApi';
import { useIssueStore } from '@/pages/backlog/model/useIssueStore';

import { useCallback, useState } from 'react';

type IssueType = 'epic' | 'sprint';
type UseIssueProps = { type: IssueType; typeId: number };

export const useIssue = ({ type, typeId }: UseIssueProps) => {
  const { issues, setIssues } = useIssueStore();

  const [isLoading, setIsLoading] = useState(false);

  const getIssues = useCallback(async () => {
    if (!typeId) return;

    try {
      setIsLoading(true);
      const response = await getIssueList(type, typeId);
      setIssues(type, typeId, response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [type, typeId, setIssues]);

  return {
    issues: issues[type][typeId],
    getIssues,
    isLoading,
  };
};
