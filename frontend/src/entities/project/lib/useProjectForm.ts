import { isOverByteSize } from '@/shared/lib';
import { ChangeEvent, useState } from 'react';
import { createProject } from '../api/projectApi';
import { useProjectStore } from './useProjectStore';

export const useProjectForm = () => {
  const { addProject } = useProjectStore();

  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectKey, setNewProjectKey] = useState('');
  const [error, setError] = useState('');

  const handleProjectNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isOverByteSize(value, 20)) {
      setError('프로젝트 이름은 20자 이하여야 합니다.');
      return;
    }

    setNewProjectName(value.trim());
  };

  const handleProjectKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^[a-zA-Z0-9]+$/;

    if (isOverByteSize(value, 20)) {
      setError('프로젝트 키는 영문 20자 이하여야 합니다.');
      return;
    }

    if (value !== '' && !regex.test(value)) {
      setError('프로젝트 키는 영문 대문자와 숫자만 사용할 수 있습니다.');
      return;
    }

    setError('');
    setNewProjectKey(value.trim().toUpperCase());
  };

  const handleSubmit = async () => {
    if (newProjectName === '' || newProjectKey === '') {
      setError('프로젝트 이름과 키를 입력해주세요.');
      return;
    }

    try {
      const response = await createProject(newProjectName, newProjectKey);
      console.log(response);

      const newProject = {
        id: response?.data?.id || -1,
        name: newProjectName,
        key: newProjectKey,
        image: null,
        todoCount: 0,
        leader: true,
      };

      addProject(newProject);

      setError('');
    } catch (error) {
      console.error(error);
      setError('프로젝트 생성에 실패했습니다.');
    }
  };

  const resetForm = () => {
    setNewProjectName('');
    setNewProjectKey('');
    setError('');
  };

  return {
    newProjectName,
    newProjectKey,
    error,
    handleProjectNameChange,
    handleProjectKeyChange,
    handleSubmit,
    resetForm,
  };
};
