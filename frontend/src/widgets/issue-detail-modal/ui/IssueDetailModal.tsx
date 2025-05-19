import { useComponent } from '@/entities/component';
import { useEpic } from '@/entities/epic';
import { useIssueModal, useIssueModalStore } from '@/widgets/issue-detail-modal';

import { useMember } from '@/entities/member';
import { SprintStatus } from '@/entities/sprint';

import { Button, IconButton } from '@/shared/ui';

import { DropDownMenu } from './DropDownMenu';
import { PopoverInput } from './PopOverMenu';
import { Tag } from './Tag';

import { clsx } from 'clsx';
import { BookOpen, Briefcase, Flag, Hash, Layers, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';

export const IssueDetailModal = () => {
  const { projectId } = useParams();
  const { issue, isOpen, closeModal } = useIssueModalStore();

  // 모든 훅은 최상단에서 호출
  const {
    key,
    name,
    content,
    assignee,
    issueStatus,
    issueImportance,
    bizPoint,
    component,
    epic,
    sprint,
    handleNameChange,
    onSubmitName,
    handleContentChange,
    onSubmitContent,
    handleAssigneeChange,
    handleIssueStatusChange,
    handleIssueImportanceChange,
    handleBizPointChange,
    handleComponentChange,
    handleEpicChange,
  } = useIssueModal();

  const [isEditing, setIsEditing] = useState({
    name: false,
    content: false,
    assignee: false,
    issueStatus: false,
    issueImportance: false,
    bizPoint: false,
    component: false,
    epic: false,
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

  const { components, getComponents } = useComponent(Number(projectId));
  const [hasFetchedComponents, setHasFetchedComponents] = useState(false);

  const { epics, getEpics } = useEpic(Number(projectId));
  const [hasFetchedEpics, setHasFetchedEpics] = useState(false);

  const { members, getMembers } = useMember(Number(projectId));
  const [hasFetchedMembers, setHasFetchedMembers] = useState(false);

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

  const statusLabels = {
    UNASSIGNED: '진행 상황',
    TODO: '해야 할 일',
    IN_PROGRESS: '진행 중',
    DONE: '완료',
  };
  const priorityLabels = {
    LOW: '낮음',
    HIGH: '높음',
  };

  if (!issue || !isOpen) return null;

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
          className={clsx('h-2 w-full rounded-t-2xl', {
            'bg-gray-300': issueStatus === 'UNASSIGNED' || issueStatus === 'TODO',
            'bg-blue-400': issueStatus === 'IN_PROGRESS',
            'bg-green-400': issueStatus === 'DONE',
          })}
        />
        {/* 닫기 버튼 */}
        <IconButton icon='x' onClick={closeModal} className='absolute top-4 right-4' />

        {/* 헤더 */}
        <div className='px-8 pt-7 pb-2'>
          <div className='flex flex-col gap-2'>
            <span className='bg-gray-1 inline-flex w-fit items-center gap-1 rounded-sm px-2 py-0.5 text-xs text-gray-600'>
              <Hash size={14} /> {key}
            </span>

            {isEditing.name ? (
              <div className='flex flex-1 items-center gap-2'>
                <input
                  value={name}
                  onChange={handleNameChange}
                  className='text-label-xxl border-gray-3 focus:border-gray-5 border-b px-2 py-1 font-bold transition-colors outline-none'
                  autoFocus
                />
                <IconButton
                  icon='check'
                  color='primary'
                  variant='solid'
                  onClick={() => {
                    onSubmitName();
                    setIsEditing({ ...isEditing, name: false });
                  }}
                />
                <IconButton
                  icon='x'
                  color='warning'
                  variant='outline'
                  onClick={() => setIsEditing({ ...isEditing, name: false })}
                />
              </div>
            ) : (
              <h2
                className='hover:bg-gray-2 text-label-xxl flex w-fit items-center rounded-md border-b border-transparent px-2 py-1 font-bold transition-colors'
                onClick={() => setIsEditing({ ...isEditing, name: true })}
              >
                {name}
              </h2>
            )}
          </div>

          {/* 태그 요약 */}
          <div className='relative mt-3 flex flex-wrap gap-2'>
            {/* 상태 */}
            <Tag
              ref={statusRef}
              name='진행 상황'
              value={issueStatus}
              className={clsx({
                'cursor-not-allowed': sprint?.sprintStatus !== SprintStatus.ONGOING,
                'text-gray-5/70 bg-transparent': issueStatus === 'UNASSIGNED',
                'bg-gray-100 text-gray-700': issueStatus === 'TODO',
                'bg-blue-100 text-blue-700': issueStatus === 'IN_PROGRESS',
                'bg-green-100 text-green-700': issueStatus === 'DONE',
              })}
              onClick={() => {
                if (sprint?.sprintStatus === SprintStatus.ONGOING) {
                  setEditField('status');
                  setAnchorRef(statusRef as React.RefObject<HTMLSpanElement>);
                }
              }}
              errorMessage={
                sprint?.sprintStatus !== SprintStatus.ONGOING
                  ? '진행 중인 스프린트의 하위 이슈만 변경할 수 있습니다.'
                  : undefined
              }
            >
              <Flag size={14} />
              {statusLabels[issueStatus as keyof typeof statusLabels]}
            </Tag>

            {/* 우선순위 */}
            <Tag
              ref={priorityRef}
              name='우선순위'
              value={issueImportance}
              className={clsx({
                'text-gray-5/70 bg-transparent': !issueImportance,
                'bg-blue-100 text-blue-800': issueImportance === 'LOW',
                'bg-red-100 text-red-800': issueImportance === 'HIGH',
              })}
              onClick={() => {
                setEditField('priority');
                setAnchorRef(priorityRef as React.RefObject<HTMLSpanElement>);
              }}
            >
              <Layers size={14} />
              {!issueImportance
                ? '우선순위'
                : priorityLabels[issueImportance as keyof typeof priorityLabels]}
            </Tag>

            {/* 스토리포인트 */}
            <Tag
              ref={storyPointsRef}
              name='비즈포인트'
              value={bizPoint || null}
              onClick={() => {
                setEditField('storyPoints');
                setAnchorRef(storyPointsRef as React.RefObject<HTMLSpanElement>);
              }}
            >
              <Briefcase size={14} />
              {bizPoint || '없음'}
            </Tag>

            {/* 컴포넌트 */}
            <Tag
              ref={componentRef}
              name='컴포넌트'
              value={component?.name}
              onClick={() => {
                setEditField('component');
                setAnchorRef(componentRef as React.RefObject<HTMLSpanElement>);
              }}
            >
              <Layers size={14} />
              {component?.name === 'UNASSIGNED' ? '컴포넌트' : component?.name || '없음'}
            </Tag>

            {/* 담당자 */}
            <Tag
              ref={assigneeRef}
              name='담당자'
              value={assignee?.id}
              onClick={() => {
                setEditField('assignee');
                setAnchorRef(assigneeRef as React.RefObject<HTMLSpanElement>);
              }}
            >
              <User size={14} />
              {assignee?.nickname || '없음'}
            </Tag>

            {/* 에픽 */}
            <Tag
              ref={epicRef}
              name='에픽'
              value={epic?.name}
              onClick={() => {
                setEditField('epic');
                setAnchorRef(epicRef as React.RefObject<HTMLSpanElement>);
              }}
            >
              <Layers size={14} />
              {epic?.name || '없음'}
            </Tag>

            {/* 스프린트(읽기전용) */}
            <Tag name='스프린트' value={sprint?.id}>
              <Layers size={14} />
              {sprint?.name || '없음'}
            </Tag>

            {/* 드롭다운/팝오버 렌더링 */}
            {editField === 'status' && anchorRef && (
              <DropDownMenu
                anchorRef={anchorRef}
                options={[
                  { label: '해야 할 일', value: 'TODO' },
                  { label: '진행 중', value: 'IN_PROGRESS' },
                  { label: '완료', value: 'DONE' },
                ]}
                value={issueStatus}
                onSelect={(v) => {
                  handleIssueStatusChange(v as any);
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
                value={issueImportance}
                onSelect={(v) => {
                  handleIssueImportanceChange({ target: { value: v } } as any);
                  setEditField(null);
                }}
                onClose={() => setEditField(null)}
              />
            )}

            {editField === 'assignee' && anchorRef && (
              <DropDownMenu
                anchorRef={anchorRef}
                options={members.map((member) => {
                  return {
                    label: member.nickname,
                    value: String(member.userId),
                  };
                })}
                value={assignee?.nickname || '없음'}
                onOpen={() => {
                  if (hasFetchedMembers) return;
                  getMembers();
                  setHasFetchedMembers(true);
                }}
                onSelect={(v) => {
                  handleAssigneeChange(Number(v));
                  setEditField(null);
                }}
                onClose={() => setEditField(null)}
              />
            )}

            {editField === 'component' && anchorRef && (
              <DropDownMenu
                anchorRef={anchorRef}
                options={components.map((component) => ({
                  label: component.name,
                  value: String(component.id),
                }))}
                value={component?.name || '없음'}
                onOpen={() => {
                  if (hasFetchedComponents) return;
                  getComponents();
                  setHasFetchedComponents(true);
                }}
                onClose={() => setEditField(null)}
                onSelect={(v) => {
                  handleComponentChange(Number(v));
                  setEditField(null);
                }}
              />
            )}

            {editField === 'epic' && anchorRef && (
              <DropDownMenu
                anchorRef={anchorRef}
                options={epics.map((epic) => ({
                  label: epic.name,
                  value: epic.id,
                }))}
                value={epic?.name || '없음'}
                onOpen={() => {
                  if (hasFetchedEpics) return;
                  getEpics();
                  setHasFetchedEpics(true);
                }}
                onSelect={(v) => {
                  handleEpicChange(Number(v));
                  setEditField(null);
                }}
                onClose={() => setEditField(null)}
              />
            )}

            {editField === 'storyPoints' && anchorRef && (
              <PopoverInput
                anchorRef={anchorRef}
                value={bizPoint ?? 0}
                onSave={(v) => {
                  handleBizPointChange(v);
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
                onClick={() => setIsEditing({ ...isEditing, content: true })}
                size={14}
                className='ml-1'
              />
            </div>
            {isEditing.content ? (
              <div className='flex flex-col gap-2'>
                <textarea
                  value={content || ''}
                  onChange={handleContentChange as any}
                  className='focus:ring-primary min-h-[120px] w-full rounded border px-3 py-2 focus:ring-2 focus:outline-none'
                />
                <div className='flex justify-end gap-2'>
                  <Button size='sm' color='primary' variant='solid' onClick={onSubmitContent}>
                    저장
                  </Button>
                  <Button
                    size='sm'
                    color='warning'
                    variant='outline'
                    onClick={() => {
                      setIsEditing({ ...isEditing, content: false });
                    }}
                  >
                    취소
                  </Button>
                </div>
              </div>
            ) : (
              <div className='min-h-[80px] rounded-md bg-white p-3 text-sm text-gray-700'>
                {content || '설명이 없습니다.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
