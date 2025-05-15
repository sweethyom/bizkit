// settings/ui/AddMemberModal.tsx
import { inviteTeamMember } from '@/pages/settings/api/settingsApi';
import { clsx } from 'clsx';
import { AlertCircle, Mail, UserPlus, X } from 'lucide-react';
import { useState } from 'react';

interface AddMemberModalProps {
  projectId: string;
  onClose: () => void;
  onInvite: () => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ projectId, onClose, onInvite }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('이메일은 필수입니다.');
      return;
    }

    if (!validateEmail(email)) {
      setError('유효한 이메일 주소를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await inviteTeamMember(projectId, { email: email.trim() });

      if (success) {
        onInvite();
        onClose();
      } else {
        setError('초대 실패: 알 수 없는 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error('Failed to invite member:', err);
      setError('초대 발송에 실패했습니다.');
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
          <h3 className={clsx('flex items-center text-xl font-semibold text-gray-900')}>
            <UserPlus size={20} className={clsx('mr-2 text-indigo-600')} />
            팀원 초대
          </h3>
          <button
            type='button'
            onClick={onClose}
            className={clsx(
              'text-gray-400 transition-colors hover:text-gray-500 focus:outline-none',
            )}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div
            className={clsx(
              'mb-4 flex items-start rounded-md border-l-4 border-red-500 bg-red-50 p-3 text-red-700',
            )}
          >
            <AlertCircle size={20} className={clsx('mr-2 flex-shrink-0')} />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={clsx('space-y-4')}>
          <div>
            <label htmlFor='email' className={clsx('mb-1 block text-sm font-medium text-gray-700')}>
              이메일 <span className={clsx('text-red-500')}>*</span>
            </label>
            <div className={clsx('relative')}>
              <div
                className={clsx(
                  'pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3',
                )}
              >
                <Mail size={18} className={clsx('text-gray-400')} />
              </div>
              <input
                type='email'
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={clsx(
                  'w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 shadow-sm transition-colors focus:border-indigo-500 focus:ring-indigo-500',
                )}
                placeholder='초대할 이메일 주소'
                disabled={isLoading}
              />
            </div>
            <p className={clsx('mt-1 text-sm text-gray-500')}>
              초대 링크가 이 이메일 주소로 발송됩니다.
            </p>
          </div>

          <div className={clsx('mt-4 flex justify-end space-x-3 border-t border-gray-200 pt-4')}>
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
                'flex items-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50',
              )}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div
                    className={clsx(
                      'mr-2 h-4 w-4 animate-spin rounded-full border-t-2 border-b-2 border-white',
                    )}
                  ></div>
                  초대 중...
                </>
              ) : (
                <>
                  <UserPlus size={16} className={clsx('mr-2')} />
                  초대하기
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;
