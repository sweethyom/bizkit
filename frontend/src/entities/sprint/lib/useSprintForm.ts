import { getByteSize } from '@/shared/lib/byteUtils';
import { useState } from 'react';
import { sprintApi } from '../api/sprintApi';
import { Sprint, SprintStatus } from '../model/sprint';
import { useSprintStore } from './useSprintStore';
export const useSprintForm = (projectId: number, initialName?: string) => {
  const { addSprint, updateSprintName } = useSprintStore();

  const [name, setName] = useState(initialName || '');
  const byteLength = getByteSize(name);
  const isValid = name.trim() !== '' && byteLength <= 40 && name !== initialName;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (getByteSize(e.target.value) > 40) return;

    setName(e.target.value);
  };

  const initName = () => {
    setName(initialName || '');
  };

  const onCreate = async (dueDate?: string) => {
    if (name.trim() === '' || name === initialName) return;

    try {
      const response = await sprintApi.createSprint(projectId, name.trim(), dueDate);

      if (!response.data) {
        throw new Error('Failed to create sprint');
      }

      console.log(response);

      const newSprint: Sprint = {
        id: response.data.id,
        name,
        startDate: null,
        dueDate: dueDate || null,
        completedDate: null,
        sprintStatus: SprintStatus.READY,
        cntRemainIssues: 0,
      };

      addSprint(newSprint);

      setName('');
    } catch (error) {
      console.error(error);
    }
  };

  const onUpdate = async (sprintId: number) => {
    if (name.trim() === '' || name === initialName) return;

    try {
      await sprintApi.updateSprint(sprintId, name.trim());
      updateSprintName(sprintId, name.trim());
    } catch (error) {
      console.error(error);
    }
  };

  return {
    name,
    byteLength,
    isValid,
    handleNameChange,
    initName,
    onCreate,
    onUpdate,
  };
};
