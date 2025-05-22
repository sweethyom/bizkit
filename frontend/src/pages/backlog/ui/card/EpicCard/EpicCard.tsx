import { useIssueModalStore } from '@/widgets/issue-detail-modal';

import { IssueForm } from '@/features/create-issue';

import { Epic, useEpicForm } from '@/entities/epic';
import { IssueCard, useIssue } from '@/entities/issue';

import { Button, DropDownSection, IconButton, UnderlineInput } from '@/shared/ui';

import { EpicCardHeader } from './EpicCardHeader';

import { Draggable, Droppable } from '@hello-pangea/dnd';
import { clsx } from 'clsx';
import { ChevronRight, Plus } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

interface EpicCardProps {
  epic: Epic;
  dragSource: string | null;
  onDeleteIssue: (epicId: number) => void;
  onDeleteEpic: (epicId: number) => void;
}

export const EpicCard = ({ epic, onDeleteIssue, onDeleteEpic, dragSource }: EpicCardProps) => {
  const { issues, getIssues, removeIssue } = useIssue({ type: 'epic', typeId: epic.id });
  const { openModal } = useIssueModalStore();

  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState('0px');

  const [showIssueForm, setShowIssueForm] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const { name, byteLength, isValid, handleNameChange, onUpdate } = useEpicForm(0, epic.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (expanded) {
      getIssues();
    }
  }, [epic.id, getIssues, expanded]);

  useEffect(() => {
    if (isEditing) {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          inputRef.current &&
          !inputRef.current.contains(e.target as Node) &&
          !buttonRef.current?.contains(e.target as Node)
        ) {
          setIsEditing(false);
        }
      };
      document.addEventListener('click', handleClickOutside, true);
      return () => {
        document.removeEventListener('click', handleClickOutside, true);
      };
    }
  }, [isEditing]);

  useLayoutEffect(() => {
    if (expanded && contentRef.current) {
      setMaxHeight(contentRef.current.scrollHeight + 'px');
    } else {
      setMaxHeight('0px');
    }
  }, [expanded, showIssueForm, issues, dragSource]);

  const moreActions = [
    {
      children: '킷 이름 수정',
      onClick: () => setIsEditing(true),
    },
    {
      children: '킷 삭제',
      onClick: () => onDeleteEpic(epic.id),
    },
  ];

  return (
    <Droppable droppableId={`epic-${epic.id}`} isDropDisabled={true}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className='border-gray-3 border-l-point flex flex-col overflow-hidden rounded-md border border-l-6 shadow-sm'
        >
          <div
            className={clsx(
              'flex cursor-pointer items-center gap-4 bg-white p-4',
              expanded && 'border-gray-2 border-b',
            )}
            onClick={() => setExpanded((prev) => !prev)}
          >
            <ChevronRight
              className={clsx(
                'text-point shrink-0 transition-transform',
                expanded ? 'rotate-90' : 'rotate-0',
              )}
            />

            {isEditing ? (
              <div className='flex w-full flex-row items-start justify-between'>
                <div className='flex flex-1 flex-col'>
                  <div className='flex items-center gap-2'>
                    <UnderlineInput
                      ref={inputRef}
                      type='text'
                      value={name}
                      onChange={handleNameChange}
                      autoFocus
                      className='text-label-lg w-full outline-none'
                      maxLength={40}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className='text-label-sm text-gray-4 whitespace-nowrap'>
                      {byteLength} / 40 byte
                    </span>
                    <IconButton
                      ref={buttonRef}
                      icon='check'
                      size={20}
                      color='primary'
                      disabled={!isValid}
                      onClick={async () => {
                        await onUpdate(epic.id);
                        setIsEditing(false);
                      }}
                    />
                    <IconButton
                      icon='x'
                      size={20}
                      color='warning'
                      onClick={() => setIsEditing(false)}
                    />
                  </div>
                  <p className='text-label-md text-gray-4 text-nowrap'>
                    전체 이슈: {epic.cntTotalIssues} | 남은 이슈: {epic.cntRemainIssues}
                  </p>
                </div>
                <div className='flex h-full flex-shrink-0 items-start'>
                  <div style={{ width: 40 }} />
                </div>
              </div>
            ) : (
              <EpicCardHeader epic={epic} />
            )}

            <DropDownSection
              items={moreActions}
              button={(toggleVisibility) => (
                <IconButton
                  icon='ellipsis'
                  onClick={() => {
                    toggleVisibility();
                  }}
                />
              )}
            />
          </div>

          <div
            ref={contentRef}
            style={{
              maxHeight,
              transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              overflow: 'hidden',
            }}
          >
            <div className='flex flex-col gap-4 p-4'>
              {showIssueForm ? (
                <IssueForm epicId={epic.id} handleVisibility={() => setShowIssueForm(false)} />
              ) : (
                <Button variant='dotted' onClick={() => setShowIssueForm(true)}>
                  <Plus size={20} />
                  이슈 추가
                </Button>
              )}

              <div className='flex flex-col gap-2'>
                {issues &&
                  issues.map((issue, index) => {
                    issue.epic = epic;
                    issue.assignee = issue.user;

                    return (
                      <Draggable
                        key={`issue-${issue.id}-${index}`}
                        draggableId={`epic-${epic.id}-issue-${issue.id}`}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className=''
                            style={{ ...provided.draggableProps.style }}
                          >
                            <IssueCard
                              issue={issue}
                              onClick={async () => {
                                openModal(issue);
                              }}
                              onDelete={() => {
                                removeIssue(issue.id);
                                onDeleteIssue(epic.id);
                              }}
                            />
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
    </Droppable>
  );
};
