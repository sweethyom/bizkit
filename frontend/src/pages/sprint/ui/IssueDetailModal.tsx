import { useState, useEffect } from 'react';
import { X, Pencil, Save, X as XIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { Issue, IssueDetailModalProps } from '@/pages/sprint/model/types';
import {
  getIssueDetail,
  updateIssueName,
  updateIssueContent,
  updateIssueAssignee,
  updateIssueStatus,
  updateIssueImportance,
  updateIssueBizpoint,
  deleteIssue,
} from '@/pages/sprint/api/sprintApi';

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({
  isOpen,
  issue,
  onClose,
  onDelete,
  onUpdate,
}) => {
  const [editableIssue, setEditableIssue] = useState<Issue | null>(issue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 편집 상태 관리
  const [isEditing, setIsEditing] = useState({
    title: false,
    description: false,
    assignee: false,
    status: false,
    priority: false,
    storyPoints: false,
  });

  // ESC 키를 누르면 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // 모달이 열려 있을 때만 키보드 이벤트 리스너 추가
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    // 정리 함수
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && issue) {
      // 모달이 열리면 이슈의 상세 정보를 가져오기
      setLoading(true);
      getIssueDetail(issue.id)
        .then((detailedIssue) => {
          setEditableIssue(detailedIssue);
          setError(null);
        })
        .catch((err) => {
          console.error('Error fetching issue details:', err);
          setError('이슈 상세 정보를 불러오는 중 오류가 발생했습니다.');
          // 에러가 발생해도 기본 이슈 정보를 표시할 수 있도록 설정
          setEditableIssue(issue);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, issue]);

  if (!isOpen || !issue || !editableIssue) return null;

  const handleDelete = async () => {
    if (issue) {
      try {
        setLoading(true);
        // API 호출
        await deleteIssue(issue.id);
        // 상위 컴포넌트에 삭제 완료 알리기
        if (onDelete) {
          onDelete(issue.id);
        }
        onClose();
      } catch (err) {
        console.error('Error deleting issue:', err);
        setError('이슈를 삭제하는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdate = async (field: string, value: string | number) => {
    if (!editableIssue) return;

    setLoading(true);
    setError(null);

    try {
      // 필드에 따라 적절한 API 호출
      switch (field) {
        case 'title':
          await updateIssueName(editableIssue.id, value as string);
          setEditableIssue({ ...editableIssue, title: value as string });
          break;
        case 'description':
          await updateIssueContent(editableIssue.id, value as string);
          setEditableIssue({ ...editableIssue, description: value as string });
          break;
        case 'assignee':
          await updateIssueAssignee(editableIssue.id, value as string);
          setEditableIssue({ ...editableIssue, assignee: value as string });
          break;
        case 'status':
          await updateIssueStatus(editableIssue.id, value as 'todo' | 'inProgress' | 'done');
          setEditableIssue({ ...editableIssue, status: value as 'todo' | 'inProgress' | 'done' });
          break;
        case 'priority':
          await updateIssueImportance(editableIssue.id, value as 'low' | 'medium' | 'high');
          setEditableIssue({ ...editableIssue, priority: value as 'low' | 'medium' | 'high' });
          break;
        case 'storyPoints':
          await updateIssueBizpoint(editableIssue.id, value as number);
          setEditableIssue({ ...editableIssue, storyPoints: value as number });
          break;
      }

      // 편집 모드 종료
      setIsEditing({ ...isEditing, [field]: false });

      // onUpdate 콜백 호출
      if (onUpdate) {
        onUpdate(editableIssue);
      }
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
      setError(`${field} 업데이트 중 오류가 발생했습니다.`);
    } finally {
      setLoading(false);
    }
  };

  const statusLabels = {
    todo: '해야 할 일',
    inProgress: '진행 중',
    done: '완료',
  };

  const priorityLabels = {
    low: '낮음',
    medium: '중간',
    high: '높음',
  };

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <div 
      className='fixed inset-0 bg-black/20 flex items-center justify-center z-50'
      onClick={(e) => {
        // 모달 내부가 아닌 외부 배경을 클릭했을 때만 모달 닫기
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className='bg-white rounded-lg p-6 w-[650px] max-h-[90vh] overflow-y-auto shadow-xl'>
        {/* 상단 헤더 */}
        <div className='flex items-center justify-between mb-4 pb-2 border-b'>
          {isEditing.title ? (
            <div className='flex-1 mr-2'>
              <input
                type='text'
                value={editableIssue.title}
                onChange={(e) => setEditableIssue({ ...editableIssue, title: e.target.value })}
                className='w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                autoFocus
              />
              <div className='flex mt-1'>
                <button
                  onClick={() => handleUpdate('title', editableIssue.title)}
                  className='mr-2 text-green-600'
                  disabled={loading}
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={() => {
                    setEditableIssue({ ...editableIssue, title: issue.title });
                    setIsEditing({ ...isEditing, title: false });
                  }}
                  className='text-red-600'
                >
                  <XIcon size={16} />
                </button>
              </div>
            </div>
          ) : (
            <h2 className='text-xl font-medium flex items-center'>
              {editableIssue.title}
              <button
                onClick={() => setIsEditing({ ...isEditing, title: true })}
                className='ml-2 text-gray-500 hover:text-gray-700'
              >
                <Pencil size={16} />
              </button>
            </h2>
          )}
          <button
            onClick={onClose}
            className='p-1 rounded-full hover:bg-gray-100 transition-colors'
            aria-label='닫기'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {loading && <div className='mb-2 text-blue-600'>로딩 중...</div>}
        {error && <div className='mb-2 text-red-600'>{error}</div>}

        {/* 정보 그리드 */}
        <div className='grid grid-cols-3 gap-4 mb-6'>
          <div>
            <p className='text-sm text-gray-500'>키</p>
            <p className='font-medium'>{editableIssue.key}</p>
          </div>
          <div>
            <p className='text-sm text-gray-500'>진행 상태</p>
            {isEditing.status ? (
              <div>
                <select
                  value={editableIssue.status}
                  onChange={(e) =>
                    setEditableIssue({
                      ...editableIssue,
                      status: e.target.value as 'todo' | 'inProgress' | 'done',
                    })
                  }
                  className='w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value='todo'>해야 할 일</option>
                  <option value='inProgress'>진행 중</option>
                  <option value='done'>완료</option>
                </select>
                <div className='flex mt-1'>
                  <button
                    onClick={() => handleUpdate('status', editableIssue.status)}
                    className='mr-2 text-green-600'
                    disabled={loading}
                  >
                    <Save size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setEditableIssue({ ...editableIssue, status: issue.status });
                      setIsEditing({ ...isEditing, status: false });
                    }}
                    className='text-red-600'
                  >
                    <XIcon size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <p className='font-medium flex items-center'>
                {statusLabels[editableIssue.status]}
                <button
                  onClick={() => setIsEditing({ ...isEditing, status: true })}
                  className='ml-2 text-gray-500 hover:text-gray-700'
                >
                  <Pencil size={16} />
                </button>
              </p>
            )}
          </div>
          <div>
            <p className='text-sm text-gray-500'>우선순위</p>
            {isEditing.priority ? (
              <div>
                <select
                  value={editableIssue.priority}
                  onChange={(e) =>
                    setEditableIssue({
                      ...editableIssue,
                      priority: e.target.value as 'low' | 'medium' | 'high',
                    })
                  }
                  className='w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value='low'>낮음</option>
                  <option value='medium'>중간</option>
                  <option value='high'>높음</option>
                </select>
                <div className='flex mt-1'>
                  <button
                    onClick={() => handleUpdate('priority', editableIssue.priority)}
                    className='mr-2 text-green-600'
                    disabled={loading}
                  >
                    <Save size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setEditableIssue({ ...editableIssue, priority: issue.priority });
                      setIsEditing({ ...isEditing, priority: false });
                    }}
                    className='text-red-600'
                  >
                    <XIcon size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className='flex items-center'>
                <p
                  className={clsx(
                    'px-2 py-1 rounded text-center text-sm w-fit',
                    priorityColors[editableIssue.priority],
                  )}
                >
                  {priorityLabels[editableIssue.priority]}
                </p>
                <button
                  onClick={() => setIsEditing({ ...isEditing, priority: true })}
                  className='ml-2 text-gray-500 hover:text-gray-700'
                >
                  <Pencil size={16} />
                </button>
              </div>
            )}
          </div>
          <div>
            <p className='text-sm text-gray-500'>스토리포인트</p>
            {isEditing.storyPoints ? (
              <div>
                <input
                  type='number'
                  value={editableIssue.storyPoints}
                  onChange={(e) =>
                    setEditableIssue({
                      ...editableIssue,
                      storyPoints: parseInt(e.target.value) || 0,
                    })
                  }
                  className='w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                  min='0'
                  max='100'
                />
                <div className='flex mt-1'>
                  <button
                    onClick={() => handleUpdate('storyPoints', editableIssue.storyPoints)}
                    className='mr-2 text-green-600'
                    disabled={loading}
                  >
                    <Save size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setEditableIssue({ ...editableIssue, storyPoints: issue.storyPoints });
                      setIsEditing({ ...isEditing, storyPoints: false });
                    }}
                    className='text-red-600'
                  >
                    <XIcon size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <p className='font-medium flex items-center'>
                {editableIssue.storyPoints}
                <button
                  onClick={() => setIsEditing({ ...isEditing, storyPoints: true })}
                  className='ml-2 text-gray-500 hover:text-gray-700'
                >
                  <Pencil size={16} />
                </button>
              </p>
            )}
          </div>
          <div>
            <p className='text-sm text-gray-500'>컴포넌트</p>
            <p className='font-medium'>{editableIssue.component}</p>
          </div>
          <div>
            <p className='text-sm text-gray-500'>담당자</p>
            {isEditing.assignee ? (
              <div>
                <input
                  type='text'
                  value={editableIssue.assignee}
                  onChange={(e) => setEditableIssue({ ...editableIssue, assignee: e.target.value })}
                  className='w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <div className='flex mt-1'>
                  <button
                    onClick={() => handleUpdate('assignee', editableIssue.assignee)}
                    className='mr-2 text-green-600'
                    disabled={loading}
                  >
                    <Save size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setEditableIssue({ ...editableIssue, assignee: issue.assignee });
                      setIsEditing({ ...isEditing, assignee: false });
                    }}
                    className='text-red-600'
                  >
                    <XIcon size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <p className='font-medium flex items-center'>
                {editableIssue.assignee}
                <button
                  onClick={() => setIsEditing({ ...isEditing, assignee: true })}
                  className='ml-2 text-gray-500 hover:text-gray-700'
                >
                  <Pencil size={16} />
                </button>
              </p>
            )}
          </div>
        </div>

        {/* 스프린트 정보 */}
        <div className='mb-4'>
          <p className='text-sm text-gray-500'>스프린트</p>
          <p className='font-medium'>{editableIssue.sprint || '할당되지 않음'}</p>
        </div>

        {/* 에픽 정보 */}
        <div className='mb-4'>
          <p className='text-sm text-gray-500'>에픽</p>
          <p className='font-medium'>{editableIssue.epic}</p>
        </div>

        {/* 내용 */}
        <div className='mb-8'>
          <p className='text-sm text-gray-500 mb-2 flex items-center'>
            내용
            <button
              onClick={() => setIsEditing({ ...isEditing, description: true })}
              className='ml-2 text-gray-500 hover:text-gray-700'
            >
              <Pencil size={16} />
            </button>
          </p>
          {isEditing.description ? (
            <div>
              <textarea
                value={editableIssue.description || ''}
                onChange={(e) =>
                  setEditableIssue({ ...editableIssue, description: e.target.value })
                }
                className='w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]'
              />
              <div className='flex mt-2'>
                <button
                  onClick={() => handleUpdate('description', editableIssue.description || '')}
                  className='mr-2 text-green-600 px-2 py-1 border border-green-600 rounded'
                  disabled={loading}
                >
                  <Save size={16} className='inline mr-1' /> 저장
                </button>
                <button
                  onClick={() => {
                    setEditableIssue({ ...editableIssue, description: issue.description });
                    setIsEditing({ ...isEditing, description: false });
                  }}
                  className='text-red-600 px-2 py-1 border border-red-600 rounded'
                >
                  <XIcon size={16} className='inline mr-1' /> 취소
                </button>
              </div>
            </div>
          ) : (
            <div className='p-3 bg-gray-50 rounded-md min-h-[100px]'>
              {editableIssue.description || '설명이 없습니다.'}
            </div>
          )}
        </div>

        {/* 버튼 영역 */}
        <div className='flex justify-end gap-2'>
          {onDelete && (
            <button
              onClick={handleDelete}
              className='px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors'
              disabled={loading}
            >
              삭제
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
