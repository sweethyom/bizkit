import { Button, IconButton } from '@/shared/ui';
import { clsx } from 'clsx';
import { BookOpen, Flag, Hash, Layers, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useIssueModalStore } from '../lib/useIssueModalStore';
import { Issue } from '../model/issue';

// 더미 데이터
const dummyAssignees = ['홍길동', '김철수', '이영희'];

// DropDownMenu: anchorRef 기준으로 absolute 포지셔닝, 외부 클릭 시 닫힘
function DropDownMenu({
  anchorRef,
  options,
  value,
  onSelect,
  onClose,
}: {
  anchorRef: React.RefObject<HTMLElement>;
  options: { label: string; value: string }[];
  value: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 0,
  });

  useEffect(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    const handleClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [anchorRef, onClose]);

  if (pos.top === 0 && pos.left === 0) return null;
  return createPortal(
    <div
      ref={menuRef}
      style={{
        position: 'absolute',
        top: pos.top,
        left: pos.left,
        minWidth: pos.width,
        zIndex: 9999,
      }}
      className='border-gray-2 animate-fadein overflow-hidden rounded-xl border bg-white shadow-2xl'
    >
      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <div
            key={opt.value}
            className='hover:bg-primary/10 hover:text-primary active:bg-primary/20 cursor-pointer px-4 py-2 text-base font-medium transition-colors duration-100'
            style={{
              fontWeight: isSelected ? 700 : 500,
              background: isSelected ? 'rgba(59,130,246,0.08)' : undefined,
              color: isSelected ? '#2563eb' : undefined,
            }}
            onClick={() => onSelect(opt.value)}
          >
            {opt.label}
          </div>
        );
      })}
    </div>,
    document.body,
  );
}

// PopoverInput: anchorRef 기준으로 absolute 포지셔닝, 외부 클릭/엔터 시 저장
function PopoverInput({
  anchorRef,
  value,
  onSave,
  onClose,
}: {
  anchorRef: React.RefObject<HTMLElement>;
  value: number;
  onSave: (v: number) => void;
  onClose: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 0,
  });
  const [val, setVal] = useState(value);
  useEffect(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    const handleClick = (e: MouseEvent) => {
      if (!inputRef.current?.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [anchorRef, onClose]);
  if (pos.top === 0 && pos.left === 0) return null;
  return createPortal(
    <input
      ref={inputRef}
      type='number'
      value={val}
      min={0}
      max={100}
      autoFocus
      style={{ position: 'absolute', top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}
      className='focus:ring-primary rounded border border-gray-200 px-2 py-1 text-sm shadow-lg outline-none focus:ring-2'
      onChange={(e) => setVal(Number(e.target.value))}
      onBlur={() => onSave(val)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSave(val);
      }}
    />,
    document.body,
  );
}

export const IssueDetailModal = () => {
  const { issue, isOpen, closeModal } = useIssueModalStore();
  const [editableIssue, setEditableIssue] = useState<Issue | null>(issue);

  const [isEditing, setIsEditing] = useState({
    title: false,
    description: false,
    assignee: false,
    status: false,
    priority: false,
    storyPoints: false,
  });
  const [editField, setEditField] = useState<null | string>(null);
  const [anchorRef, setAnchorRef] = useState<React.RefObject<HTMLSpanElement> | null>(null);

  // 태그별 ref
  const statusRef = useRef<HTMLSpanElement>(null) as React.RefObject<HTMLSpanElement>;
  const priorityRef = useRef<HTMLSpanElement>(null) as React.RefObject<HTMLSpanElement>;
  const storyPointsRef = useRef<HTMLSpanElement>(null) as React.RefObject<HTMLSpanElement>;
  const assigneeRef = useRef<HTMLSpanElement>(null) as React.RefObject<HTMLSpanElement>;
  const componentRef = useRef<HTMLSpanElement>(null) as React.RefObject<HTMLSpanElement>;
  const epicRef = useRef<HTMLSpanElement>(null) as React.RefObject<HTMLSpanElement>;

  useEffect(() => {
    console.log(issue);
    setEditableIssue(issue);
  }, [issue]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeModal]);

  if (!issue || !editableIssue || !isOpen) return null;

  const statusLabels = {
    TODO: '해야 할 일',
    IN_PROGRESS: '진행 중',
    DONE: '완료',
  };
  const priorityLabels = {
    LOW: '낮음',
    HIGH: '높음',
  };

  const statusColor = {
    UNASSIGNED: 'bg-gray-300',
    TODO: 'bg-gray-300',
    IN_PROGRESS: 'bg-blue-400',
    DONE: 'bg-green-400',
  };

  const statusTagColor = {
    TODO: 'bg-gray-100 text-gray-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    DONE: 'bg-green-100 text-green-700',
  };

  const priorityTagColor = {
    LOW: 'bg-blue-100 text-blue-800',
    HIGH: 'bg-red-100 text-red-800',
  };

  // 저장 핸들러 예시 (실제 API 연동 시 이 부분만 교체)
  const handleSave = (field: string, value: any) => {
    setEditableIssue((prev) => (prev ? { ...prev, [field]: value } : prev));
    setEditField(null);
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/30'
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div className='relative flex max-h-[90vh] w-full max-w-3xl flex-col gap-4 overflow-y-auto rounded-2xl bg-white shadow-2xl'>
        {/* 상태별 컬러 바 */}
        <div
          className={clsx(
            'h-2 w-full rounded-t-2xl',
            statusColor[editableIssue.issueStatus as keyof typeof statusColor],
          )}
        />
        {/* 닫기 버튼 */}
        <IconButton icon='x' onClick={closeModal} className='absolute top-4 right-4' />

        {/* 헤더 */}
        <div className='px-8 pt-7 pb-2'>
          <div className='flex flex-col gap-2'>
            <span className='bg-gray-1 inline-flex w-fit items-center gap-1 rounded-sm px-2 py-0.5 text-xs text-gray-600'>
              <Hash size={14} /> {editableIssue.key}
            </span>

            {isEditing.title ? (
              <div className='flex flex-1 items-center gap-2'>
                <input
                  value={editableIssue.name}
                  onChange={(e) => setEditableIssue({ ...editableIssue, name: e.target.value })}
                  className='text-label-xxl border-gray-3 focus:border-gray-5 border-b px-2 py-1 font-bold transition-colors outline-none'
                  autoFocus
                />
                <IconButton
                  icon='check'
                  color='primary'
                  variant='solid'
                  onClick={() => setIsEditing({ ...isEditing, title: false })}
                />
                <IconButton
                  icon='x'
                  color='warning'
                  variant='outline'
                  onClick={() => setIsEditing({ ...isEditing, title: false })}
                />
              </div>
            ) : (
              <h2
                className='hover:bg-gray-2 text-label-xxl flex w-fit items-center rounded-md border-b border-transparent px-2 py-1 font-bold transition-colors'
                onClick={() => setIsEditing({ ...isEditing, title: true })}
              >
                {editableIssue.name}
              </h2>
            )}
          </div>

          {/* 태그 요약 */}
          <div className='relative mt-3 flex flex-wrap gap-2'>
            {/* 상태 */}
            <span
              ref={statusRef}
              className={clsx(
                'inline-flex cursor-pointer items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold',
                statusTagColor[editableIssue.issueStatus as keyof typeof statusTagColor],
              )}
              onClick={() => {
                setEditField('status');
                setAnchorRef(statusRef as React.RefObject<HTMLSpanElement>);
              }}
            >
              <Flag size={14} />
              {editableIssue.issueStatus === 'UNASSIGNED' ? (
                <span className='font-semibold'>상태</span>
              ) : (
                <span className='ml-1'>
                  {statusLabels[editableIssue.issueStatus as keyof typeof statusLabels]}
                </span>
              )}
            </span>

            {/* 우선순위 */}
            <span
              ref={priorityRef}
              className={clsx(
                'inline-flex cursor-pointer items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold',
                priorityTagColor[editableIssue.issueImportance as keyof typeof priorityTagColor],
              )}
              onClick={() => {
                setEditField('priority');
                setAnchorRef(priorityRef as React.RefObject<HTMLSpanElement>);
              }}
            >
              <Layers size={14} />
              {editableIssue.issueImportance ? (
                <span className='ml-1'>
                  {priorityLabels[editableIssue.issueImportance as keyof typeof priorityLabels]}
                </span>
              ) : (
                <span className='font-semibold'>우선순위</span>
              )}
            </span>

            {/* 스토리포인트 */}
            <span
              ref={storyPointsRef}
              className='inline-flex cursor-pointer items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600'
              onClick={() => {
                setEditField('storyPoints');
                setAnchorRef(storyPointsRef as React.RefObject<HTMLSpanElement>);
              }}
            >
              <BookOpen size={14} /> <span className='font-semibold'>스토리포인트</span>{' '}
              <span className='ml-1'>{editableIssue.bizPoint ?? 0}</span>
            </span>
            {/* 컴포넌트 */}
            <span
              ref={componentRef}
              className='inline-flex cursor-pointer items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600'
              onClick={() => {
                setEditField('component');
                setAnchorRef(componentRef as React.RefObject<HTMLSpanElement>);
              }}
            >
              <Layers size={14} />
              {editableIssue.component?.name === 'UNASSIGNED' ? (
                <span className='font-semibold'>컴포넌트</span>
              ) : (
                <span className='ml-1'>{editableIssue.component?.name || '없음'}</span>
              )}
            </span>
            {/* 담당자 */}
            <span
              ref={assigneeRef}
              className='inline-flex cursor-pointer items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600'
              onClick={() => {
                setEditField('assignee');
                setAnchorRef(assigneeRef as React.RefObject<HTMLSpanElement>);
              }}
            >
              <User size={14} /> <span className='font-semibold'>담당자</span>{' '}
              <span className='ml-1'>{editableIssue.assignee?.nickname || '없음'}</span>
            </span>
            {/* 에픽 */}
            <span
              ref={epicRef}
              className='inline-flex cursor-pointer items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600'
              onClick={() => {
                setEditField('epic');
                setAnchorRef(epicRef as React.RefObject<HTMLSpanElement>);
              }}
            >
              <Layers size={14} /> <span className='font-semibold'>에픽</span>{' '}
              <span className='ml-1'>{editableIssue.epic?.name || '없음'}</span>
            </span>
            {/* 스프린트(읽기전용) */}
            <span className='inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600'>
              <span className='font-semibold'>스프린트</span>{' '}
              {editableIssue.project?.name || '없음'}
            </span>
            {/* 드롭다운/팝오버 렌더링 */}
            {editField === 'status' && anchorRef && (
              <DropDownMenu
                anchorRef={anchorRef}
                options={[
                  { label: '해야 할 일', value: 'TODO' },
                  { label: '진행 중', value: 'IN_PROGRESS' },
                  { label: '완료', value: 'DONE' },
                ]}
                value={editableIssue.issueStatus}
                onSelect={(v) => {
                  handleSave('issueStatus', v);
                  setEditField(null);
                }}
                onClose={() => setEditField(null)}
              />
            )}
            {editField === 'priority' && anchorRef && (
              <DropDownMenu
                anchorRef={anchorRef}
                options={[
                  { label: '높음', value: 'HIGH' },
                  { label: '낮음', value: 'LOW' },
                ]}
                value={editableIssue.issueImportance}
                onSelect={(v) => {
                  handleSave('issueImportance', v);
                  setEditField(null);
                }}
                onClose={() => setEditField(null)}
              />
            )}
            {editField === 'assignee' && anchorRef && (
              <DropDownMenu
                anchorRef={anchorRef}
                options={dummyAssignees.map((name) => ({ label: name, value: name }))}
                value={editableIssue.assignee?.nickname || '없음'}
                onSelect={(v) => {
                  handleSave('assignee', { ...editableIssue.assignee, nickname: v });
                  setEditField(null);
                }}
                onClose={() => setEditField(null)}
              />
            )}
            {editField === 'component' && anchorRef && (
              <DropDownMenu
                anchorRef={anchorRef}
                options={['컴포넌트A', '컴포넌트B'].map((name) => ({ label: name, value: name }))}
                value={editableIssue.component?.name || '없음'}
                onSelect={(v) => {
                  handleSave('component', { ...editableIssue.component, name: v });
                  setEditField(null);
                }}
                onClose={() => setEditField(null)}
              />
            )}
            {editField === 'epic' && anchorRef && (
              <DropDownMenu
                anchorRef={anchorRef}
                options={['에픽1', '에픽2', '에픽3'].map((name) => ({ label: name, value: name }))}
                value={editableIssue.epic?.name || '없음'}
                onSelect={(v) => {
                  handleSave('epic', { ...editableIssue.epic, name: v });
                  setEditField(null);
                }}
                onClose={() => setEditField(null)}
              />
            )}
            {editField === 'storyPoints' && anchorRef && (
              <PopoverInput
                anchorRef={anchorRef}
                value={editableIssue.bizPoint ?? 0}
                onSave={(v) => {
                  handleSave('bizPoint', v);
                  setEditField(null);
                }}
                onClose={() => setEditField(null)}
              />
            )}
          </div>
        </div>
        {/* 내용 */}
        <div className='px-8 pb-8'>
          <div className='flex flex-col gap-2 rounded-lg bg-gray-50 p-4 shadow-sm'>
            <div className='flex items-center gap-2 text-xs text-gray-400'>
              <BookOpen size={14} /> 내용
              <IconButton
                icon='pencil'
                onClick={() => setIsEditing({ ...isEditing, description: true })}
                size={14}
                className='ml-1'
              />
            </div>
            {isEditing.description ? (
              <div className='flex flex-col gap-2'>
                <textarea
                  value={editableIssue.content || ''}
                  onChange={(e) => setEditableIssue({ ...editableIssue, content: e.target.value })}
                  className='focus:ring-primary min-h-[120px] w-full rounded border px-3 py-2 focus:ring-2 focus:outline-none'
                />
                <div className='flex justify-end gap-2'>
                  <Button size='sm' color='primary' variant='solid'>
                    {/* <Save size={16} className='mr-1' /> */}
                    저장
                  </Button>
                  <Button
                    size='sm'
                    color='warning'
                    variant='outline'
                    onClick={() => {
                      setEditableIssue({ ...editableIssue, content: issue.content });
                      setIsEditing({ ...isEditing, description: false });
                    }}
                  >
                    {/* <X size={16} className='mr-1' /> */}
                    취소
                  </Button>
                </div>
              </div>
            ) : (
              <div className='min-h-[80px] rounded-md bg-white p-3 text-sm text-gray-700'>
                {editableIssue.content || '설명이 없습니다.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
