import { deleteIssue, getIssueList } from '@/entities/issue/api/issueApi';
import { useIssueStore } from '@/entities/issue/lib/useIssueStore';

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

  const removeIssue = async (issueId: number) => {
    try {
      await deleteIssue(issueId);

      setIssues(
        type,
        typeId,
        issues[type][typeId].filter((issue) => issue.id !== issueId),
      );
    } catch (error) {
      console.error(error);
    }
  };

  return {
    issues: issues[type][typeId],
    getIssues,
    removeIssue,
    isLoading,
  };
};
