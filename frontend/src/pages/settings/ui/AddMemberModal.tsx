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
        'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn',
      )}
    >
      <div className={clsx('bg-white rounded-xl shadow-lg p-6 w-full max-w-md animate-scaleIn')}>
        <div className={clsx('flex justify-between items-center mb-4')}>
          <h3 className={clsx('text-xl font-semibold text-gray-900 flex items-center')}>
            <UserPlus size={20} className={clsx('mr-2 text-indigo-600')} />
            팀원 초대
          </h3>
          <button
            type='button'
            onClick={onClose}
            className={clsx(
              'text-gray-400 hover:text-gray-500 focus:outline-none transition-colors',
            )}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div
            className={clsx(
              'mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md flex items-start',
            )}
          >
            <AlertCircle size={20} className={clsx('mr-2 flex-shrink-0')} />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={clsx('space-y-4')}>
          <div>
            <label htmlFor='email' className={clsx('block text-sm font-medium text-gray-700 mb-1')}>
              이메일 <span className={clsx('text-red-500')}>*</span>
            </label>
            <div className={clsx('relative')}>
              <div
                className={clsx(
                  'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none',
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
                  'w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors',
                )}
                placeholder='초대할 이메일 주소'
                disabled={isLoading}
              />
            </div>
            <p className={clsx('mt-1 text-sm text-gray-500')}>
              초대 링크가 이 이메일 주소로 발송됩니다.
            </p>
          </div>

          <div className={clsx('flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-4')}>
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
                'flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors',
              )}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div
                    className={clsx(
                      'w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2',
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
