import { createIssue } from '@/entities/issue/api/issueApi';

import { getByteSize } from '@/shared/lib';

import { ChangeEvent, FormEvent, useState } from 'react';

export const useIssueForm = (epicId: number) => {
  const [issueName, setIssueName] = useState('');
  const byteLength = getByteSize(issueName);
  const [isError, setIsError] = useState(false);

  const handleIssueNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (getByteSize(e.target.value) > 40) return;

    setIssueName(e.target.value);
  };

  const handleCreateIssue = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (issueName.length === 0) {
      setIsError(true);
      return;
    }

    try {
      const issue = await createIssue(epicId, issueName);
      console.log(issue);
    } catch (error) {
      console.error(error);
    }

    console.log(epicId, issueName);
  };

  return { issueName, byteLength, isError, handleIssueNameChange, handleCreateIssue };
};
