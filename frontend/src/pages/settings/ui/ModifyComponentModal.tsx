// settings/ui/ModifyComponentModal.tsx
import { updateComponent } from '@/pages/settings/api/settingsApi';
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
    setDescription(component.description || '');
    setIsDirty(false);
  }, [component]);

  // 폼 변경 감지
  useEffect(() => {
    const isNameChanged = name !== component.name;
    const isDescChanged = description !== (component.description || '');
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
      const updatedComponent = await updateComponent(projectId, {
        ...component,
        name: name.trim(),
        description: description.trim() || undefined,
      });

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
        'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn',
      )}
    >
      <div className={clsx('bg-white rounded-xl shadow-lg p-6 w-full max-w-md animate-scaleIn')}>
        <div className={clsx('flex justify-between items-center mb-4')}>
          <h3 className={clsx('text-xl font-semibold text-gray-900')}>컴포넌트 수정</h3>
          <button
            type='button'
            onClick={onClose}
            className={clsx(
              'text-gray-400 hover:text-gray-500 focus:outline-none transition-colors',
            )}
          >
            <X className={clsx('h-6 w-6')} />
          </button>
        </div>

        {error && (
          <div
            className={clsx(
              'mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md flex items-start',
            )}
          >
            <AlertCircle size={20} className={clsx('mr-2 flex-shrink-0 mt-0.5')} />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={clsx('space-y-4')}>
          <div>
            <label htmlFor='name' className={clsx('block text-sm font-medium text-gray-700 mb-1')}>
              이름 <span className={clsx('text-red-500')}>*</span>
            </label>
            <input
              type='text'
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={clsx(
                'w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors',
              )}
              placeholder='컴포넌트 이름'
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor='description'
              className={clsx('block text-sm font-medium text-gray-700 mb-1')}
            >
              설명
            </label>
            <textarea
              id='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={clsx(
                'w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-colors',
              )}
              placeholder='컴포넌트 설명 (선택사항)'
              disabled={isLoading}
            />
          </div>

          <div className={clsx('flex justify-end space-x-3 pt-4 border-t border-gray-200')}>
            <button
              type='button'
              onClick={onClose}
              className={clsx(
                'px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors',
              )}
              disabled={isLoading}
            >
              취소
            </button>
            <button
              type='submit'
              className={clsx(
                'flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50',
                {
                  'bg-indigo-600 hover:bg-indigo-700': isDirty,
                  'bg-gray-400 cursor-not-allowed': !isDirty,
                },
              )}
              disabled={isLoading || !isDirty}
            >
              {isLoading ? (
                <>
                  <div
                    className={clsx(
                      'w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2',
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
