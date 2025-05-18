// settings/ui/ModifyComponentModal.tsx
import { updateComponent, updateComponentContent, updateComponentName } from '@/pages/settings/api/settingsApi';
import { Component } from '@/pages/settings/model/types';
import { clsx } from 'clsx';
import { AlertCircle, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ModifyComponentModalProps {
  projectId: string;
  component: Component;
  onClose: () => void;
  onUpdate: (updatedComponent: Component) => void;
}

const ModifyComponentModal: React.FC<ModifyComponentModalProps> = ({
  projectId,
  component,
  onClose,
  onUpdate,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false); // 폼 변경 여부 추적

  useEffect(() => {
    setName(component.name);
    setDescription(component.content || '');
    setIsDirty(false);
  }, [component]);

  // 폼 변경 감지
  useEffect(() => {
    const isNameChanged = name !== component.name;
    const isDescChanged = description !== (component.content || '');
    setIsDirty(isNameChanged || isDescChanged);
  }, [name, description, component]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('컴포넌트 이름은 필수입니다.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 수정된 API 함수 시그니처에 따라 이름과 설명 변경 모두 별도 호출
      const componentId = typeof component.id === 'string' ? parseInt(component.id) : component.id;
      
      // 이름 변경했는지 확인
      if (name.trim() !== component.name) {
        console.log('이름 변경 시도: ', name.trim());
        await updateComponentName(componentId, name.trim());
      }
      
      // 설명 변경했는지 확인
      if (description.trim() !== (component.content || '')) {
        console.log('설명 변경 시도: ', description.trim());
        await updateComponentContent(componentId, description.trim());
      }

      // 업데이트된 컴포넌트 객체 생성
      const updatedComponent = {
        ...component,
        name: name.trim(),
        content: description.trim() || undefined
      };

      onUpdate(updatedComponent);
      onClose();
    } catch (err) {
      console.error('Failed to update component:', err);
      setError('컴포넌트 수정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={clsx(
        'bg-opacity-50 animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black p-4',
      )}
    >
      <div className={clsx('animate-scaleIn w-full max-w-md rounded-xl bg-white p-6 shadow-lg')}>
        <div className={clsx('mb-4 flex items-center justify-between')}>
          <h3 className={clsx('text-xl font-semibold text-gray-900')}>컴포넌트 수정</h3>
          <button
            type='button'
            onClick={onClose}
            className={clsx(
              'text-gray-400 transition-colors hover:text-gray-500 focus:outline-none',
            )}
          >
            <X className={clsx('h-6 w-6')} />
          </button>
        </div>

        {error && (
          <div
            className={clsx(
              'mb-4 flex items-start rounded-md border-l-4 border-red-500 bg-red-50 p-3 text-red-700',
            )}
          >
            <AlertCircle size={20} className={clsx('mt-0.5 mr-2 flex-shrink-0')} />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={clsx('space-y-4')}>
          <div>
            <label htmlFor='name' className={clsx('mb-1 block text-sm font-medium text-gray-700')}>
              이름 <span className={clsx('text-red-500')}>*</span>
            </label>
            <input
              type='text'
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={clsx(
                'w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm transition-colors focus:border-indigo-500 focus:ring-indigo-500',
              )}
              placeholder='컴포넌트 이름'
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor='description'
              className={clsx('mb-1 block text-sm font-medium text-gray-700')}
            >
              설명
            </label>
            <textarea
              id='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={clsx(
                'w-full resize-none rounded-lg border border-gray-300 px-4 py-2 shadow-sm transition-colors focus:border-indigo-500 focus:ring-indigo-500',
              )}
              placeholder='컴포넌트 설명 (선택사항)'
              disabled={isLoading}
            />
          </div>

          <div className={clsx('flex justify-end space-x-3 border-t border-gray-200 pt-4')}>
            <button
              type='button'
              onClick={onClose}
              className={clsx(
                'rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none',
              )}
              disabled={isLoading}
            >
              취소
            </button>
            <button
              type='submit'
              className={clsx(
                'flex items-center rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-white transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50',
                {
                  'bg-indigo-600 hover:bg-indigo-700': isDirty,
                  'cursor-not-allowed bg-gray-400': !isDirty,
                },
              )}
              disabled={isLoading || !isDirty}
            >
              {isLoading ? (
                <>
                  <div
                    className={clsx(
                      'mr-2 h-4 w-4 animate-spin rounded-full border-t-2 border-b-2 border-white',
                    )}
                  ></div>
                  저장 중...
                </>
              ) : (
                <>
                  <Save size={16} className={clsx('mr-2')} />
                  변경사항 저장
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModifyComponentModal;
