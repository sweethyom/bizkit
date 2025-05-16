import { createEpic } from '@/entities/epic/api/epicApi';
import { getByteSize } from '@/shared/lib/byteUtils';

import { useState } from 'react';
import { useEpicStore } from './useEpicStore';

export const useEpicForm = (projectId: number) => {
  const { addEpic } = useEpicStore();

  const [name, setName] = useState('');
  const byteLength = getByteSize(name);
  const isValid = name.trim() !== '' && byteLength <= 40;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (getByteSize(e.target.value) > 40) return;
    setName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isValid) {
      const response = await createEpic(projectId, name);

      console.log(response);

      const epic = {
        id: response.data!.id,
        key: '생성 시 받아야 함',
        name,
        cntTotalIssues: 0,
        cntRemainIssues: 0,
      };

      addEpic(epic);
    }
  };

  return { name, byteLength, isValid, handleNameChange, handleSubmit };
};
