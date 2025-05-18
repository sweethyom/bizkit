import { Issue } from '@/entities/issue';
import { createIssue } from '@/entities/issue/api/issueApi';

import { getByteSize } from '@/shared/lib';

import { ChangeEvent, useState } from 'react';
import { useParams } from 'react-router';
import { useIssueStore } from './useIssueStore';

export const useIssueForm = (epicId: number) => {
  const { projectId } = useParams();
  const { addIssue } = useIssueStore();

  const [issueName, setIssueName] = useState('');
  const byteLength = getByteSize(issueName);
  const [isError, setIsError] = useState(false);

  const handleIssueNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (getByteSize(e.target.value) > 40) return;

    setIssueName(e.target.value);
  };

  const handleSubmit = async () => {
    if (issueName.length === 0) {
      setIsError(true);
      return;
    }

    try {
      const issue = await createIssue(epicId, issueName);

      if (!issue.data) {
        throw new Error('Failed to create issue');
      }

      const newIssue: Issue = {
        id: issue.data.id,
        name: issueName,
        content: '',
        key: '생성 시 응답 키',
        bizPoint: 0,
        issueImportance: null,
        issueStatus: 'UNASSIGNED',
        project: {
          id: Number(projectId),
          name: '',
        },
        component: {
          id: null,
          name: '',
        },
        assignee: {
          id: null,
          nickname: '',
          profileImageUrl: '',
        },
        epic: {
          id: epicId,
          name: '',
          key: '',
        },
      };

      addIssue(newIssue);
    } catch (error) {
      console.error(error);
    }
  };

  return { issueName, byteLength, isError, handleIssueNameChange, handleSubmit };
};
