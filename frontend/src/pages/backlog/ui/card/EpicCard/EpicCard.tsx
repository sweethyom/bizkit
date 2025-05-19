import { SectionCard } from '@/pages/backlog/ui/card/SectionCard';

import { useIssueModalStore } from '@/widgets/issue-detail-modal';

import { deleteEpic, Epic, useEpicForm } from '@/entities/epic';
import { IssueCard, IssueForm, useIssue } from '@/entities/issue';

import { Button, IconButton, UnderlineInput } from '@/shared/ui';

import { EpicCardHeader } from './EpicCardHeader';

import { Draggable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface EpicCardProps {
  epic: Epic;
  onDeleteIssue: (epicId: number) => void;
  onDeleteEpic: (epicId: number) => void;
}

export const EpicCard = ({ epic, onDeleteIssue, onDeleteEpic }: EpicCardProps) => {
  const { issues, getIssues, removeIssue } = useIssue({ type: 'epic', typeId: epic.id });
  const { openModal } = useIssueModalStore();

  const [expanded, setExpanded] = useState(false);

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

  return (
    <SectionCard
      cardType='epic'
      cardId={epic.id}
      expanded={expanded}
      toggleExpanded={() => setExpanded((prev) => !prev)}
      header={
        isEditing ? (
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
        )
      }
      moreActions={[
        {
          children: '에픽 수정',
          onClick: () => setIsEditing(true),
        },
        {
          children: '에픽 삭제',
          onClick: async () => {
            const response = await deleteEpic(epic.id);
            console.log(response);
            onDeleteEpic(epic.id);
          },
        },
      ]}
    >
      <>
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
                  key={issue.id}
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
      </>
    </SectionCard>
  );
};
