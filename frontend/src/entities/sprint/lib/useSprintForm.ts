import { getByteSize } from '@/shared/lib/byteUtils';
import { useState } from 'react';
import { createSprint } from '../api/sprintApi';

export const useSprintForm = (projectId: number) => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const byteLength = getByteSize(name);
  const isValid = name.trim() !== '' && byteLength <= 40;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (getByteSize(e.target.value) > 40) return;

    setName(e.target.value);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await createSprint(projectId, name);
    console.log(response);
  };

  return {
    name,
    startDate,
    endDate,
    byteLength,
    isValid,
    handleNameChange,
    handleStartDateChange,
    handleEndDateChange,
    handleSubmit,
  };
};
