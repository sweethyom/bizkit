import { createEpic } from '@/entities/epic/api/epicApi';
import { getByteSize } from '@/shared/lib/byteUtils';

import { useState } from 'react';
import { useEpicStore } from './useEpicStore';

export const useEpicForm = (projectId: number, initialName?: string) => {
  const { addEpic, updateEpicName } = useEpicStore();

  const [name, setName] = useState(initialName || '');
  const byteLength = getByteSize(name);
  const isValid = name.trim() !== '' && byteLength <= 40 && name !== initialName;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (getByteSize(e.target.value) > 40) return;
    setName(e.target.value);
  };

  const onCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValid) return;

    const response = await createEpic(projectId, name);

    console.log(response);

    const epic = {
      id: response.data!.id,
      key: 'TEMP-KEY',
      name,
      cntTotalIssues: 0,
      cntRemainIssues: 0,
    };

    addEpic(epic);
  };

  const onUpdate = async (epicId: number) => {
    if (!isValid) return;

    updateEpicName(epicId, name);
  };

  return { name, byteLength, isValid, handleNameChange, onCreate, onUpdate };
};
