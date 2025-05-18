import { useState, useEffect, useRef } from 'react';
import { BookOpen, Briefcase, Flag, Hash, Layers, User, X } from 'lucide-react';
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
  updateIssueComponent,
  updateIssueEpic,
  updateIssueSprint,
  getProjectComponents,
  getProjectEpics,
  getProjectSprints,
  getProjectMembers,
  deleteIssue,
} from '@/pages/sprint/api/sprintApi';
import { Tag } from './Tag';
import { DropDownMenu } from './DropDownMenu';
import { PopoverInput } from './PopoverInput';

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({
  isOpen,
  issue,
  projectId,
  onClose,
  onDelete,
  onUpdate,
}) => {
  // 기본 상태 관리
  const [editableIssue, setEditableIssue] = useState<Issue | null>(issue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 편집 상태 관리
  const [isEditing, setIsEditing] = useState({
    title: false,
    description: false,
  });
  
  // 드롭다운 메뉴를 위한 상태
  const [editField, setEditField] = useState<null | string>(null);
  
  // 태그 참조
  const statusRef = useRef<HTMLSpanElement>(null);
  const priorityRef = useRef<HTMLSpanElement>(null);
  const storyPointsRef = useRef<HTMLSpanElement>(null);
  const assigneeRef = useRef<HTMLSpanElement>(null);
  const componentRef = useRef<HTMLSpanElement>(null);
  const epicRef = useRef<HTMLSpanElement>(null);
  const sprintRef = useRef<HTMLSpanElement>(null);
  
  // 프로젝트 데이터 상태 관리
  const [components, setComponents] = useState<{id: string, name: string}[]>([]);
  const [epics, setEpics] = useState<{id: string, name: string}[]>([]);
  const [sprints, setSprints] = useState<{id: string, name: string, status: string}[]>([]);
  const [members, setMembers] = useState<{id: string, nickname: string}[]>([]);
  
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

  // 에픽, 컴포넌트, 스프린트, 멤버 데이터 가져오기
  const loadProjectData = async () => {
    try {
      // Props로 전달받은 프로젝트 ID 사용
      if (!projectId) {
        console.error('No project ID provided in props');
        return;
      }
      
      console.log('Loading data for project ID:', projectId);
      
      // 각 데이터 가져오기 - 병렬로 로딩 처리
      try {
        const [componentsData, epicsData, sprintsData, membersData] = await Promise.all([
          getProjectComponents(projectId),
          getProjectEpics(projectId),
          getProjectSprints(projectId),
          getProjectMembers(projectId)
        ]);
      
        console.log('Fetched data:', { componentsData, epicsData, sprintsData, membersData });
      
        // 데이터 포맷 통일 (백엔드 응답에 맞게 필요에 따라 조정)
        setComponents(componentsData.map(c => ({ id: c.id.toString(), name: c.name })));
        setEpics(epicsData.map(e => ({ id: e.id.toString(), name: e.name })));
        setSprints(sprintsData.map(s => ({ 
          id: s.id.toString(), 
          name: s.name, 
          status: s.status // READY, ONGOING, COMPLETED 등
        })));
        setMembers(membersData.map(m => ({ id: m.id.toString(), nickname: m.nickname })));
      } catch (error) {
        console.error('Error in one of the project data API calls:', error);
        // 일부 API가 실패해도 더미 데이터라도 설정
        if (!components.length) setComponents([{ id: '', name: '설정되지 않음' }]);
        if (!epics.length) setEpics([{ id: '', name: '설정되지 않음' }]);
        if (!sprints.length) setSprints([{ id: '', name: '설정되지 않음', status: 'READY' }]);
        if (!members.length) setMembers([{ id: '', nickname: '설정되지 않음' }]);
      }
    } catch (err) {
      console.error('Error loading project data:', err);
      setError('프로젝트 데이터를 불러오는 중 오류가 발생했습니다.');
    }
  };

  // 이슈 상세 정보 가져오기
  useEffect(() => {
    if (isOpen && issue) {
      setLoading(true);
      
      // 프로젝트 데이터 로딩
      loadProjectData();
      
      // 이슈 상세 정보 로딩
      console.log('Loading issue details for issue ID:', issue.id);
      getIssueDetail(issue.id)
        .then((detailedIssue) => {
          console.log('Received issue details:', detailedIssue);
          setEditableIssue(detailedIssue);
          setError(null);
        })
        .catch((err) => {
          console.error('Error fetching issue details:', err);
          setError('이슈 상세 정보를 불러오는 중 오류가 발생했습니다.');
          // 오류 발생 시 전달받은 이슈 데이터를 기본으로 사용
          setEditableIssue(issue);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, issue, projectId]); // projectId 의존성 추가

  if (!isOpen || !issue || !editableIssue) return null;

  // 이슈 삭제 처리
  const handleDelete = async () => {
    if (issue) {
      try {
        setLoading(true);
        // API 명세에 맞게 DELETE 메서드로 호출
        await deleteIssue(issue.id);
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

  // 이슈 제목 업데이트
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editableIssue) {
      setEditableIssue({ ...editableIssue, title: e.target.value });
    }
  };

  const onSubmitName = async () => {
    if (!editableIssue) return;
    setLoading(true);
    setError(null);
    
    try {
      // API 명세에 맞게 name 키로 전송 (title을 name으로 사용)
      await updateIssueName(editableIssue.id, editableIssue.title);
      if (onUpdate) {
        onUpdate(editableIssue);
      }
    } catch (err) {
      console.error('Error updating title:', err);
      setError('제목 업데이트 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 이슈 내용 업데이트
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (editableIssue) {
      setEditableIssue({ ...editableIssue, description: e.target.value });
    }
  };

  const onSubmitContent = async () => {
    if (!editableIssue) return;
    setLoading(true);
    setError(null);
    
    try {
      // API 명세에 맞게 content 키로 전송 (description을 content로 사용)
      await updateIssueContent(editableIssue.id, editableIssue.description || '');
      if (onUpdate) {
        onUpdate(editableIssue);
      }
    } catch (err) {
      console.error('Error updating content:', err);
      setError('내용 업데이트 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      setIsEditing({ ...isEditing, description: false });
    }
  };

  // 이슈 상태 업데이트
  const handleIssueStatusChange = async (newStatus: string) => {
    if (!editableIssue) return;
    setLoading(true);
    setError(null);
    
    const statusMapping: Record<string, 'todo' | 'inProgress' | 'done'> = {
      'TODO': 'todo',
      'IN_PROGRESS': 'inProgress',
      'DONE': 'done'
    };
    
    // API에서 받은 값을 클라이언트 표현으로 변환
    const newStatusNormalized = statusMapping[newStatus];
    
    try {
      await updateIssueStatus(editableIssue.id, newStatusNormalized);
      setEditableIssue({ ...editableIssue, status: newStatusNormalized });
      if (onUpdate) {
        onUpdate({ ...editableIssue, status: newStatusNormalized });
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError('상태 업데이트 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 이슈 중요도 업데이트
  const handleIssueImportanceChange = async (e: { target: { value: string } }) => {
    if (!editableIssue) return;
    setLoading(true);
    setError(null);
    
    const importanceMapping: Record<string, 'low' | 'medium' | 'high'> = {
      'LOW': 'low',
      'MEDIUM': 'medium',
      'HIGH': 'high'
    };
    
    // API에서 사용하는 값을 클라이언트 표현으로 변환
    const newImportance = importanceMapping[e.target.value] || 'low';
    
    try {
      await updateIssueImportance(editableIssue.id, newImportance);
      setEditableIssue({ ...editableIssue, priority: newImportance });
      if (onUpdate) {
        onUpdate({ ...editableIssue, priority: newImportance });
      }
    } catch (err) {
      console.error('Error updating importance:', err);
      setError('중요도 업데이트 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 비즈포인트 업데이트
  const handleBizPointChange = async (newValue: number) => {
    if (!editableIssue) return;
    setLoading(true);
    setError(null);
    
    try {
      // API 명세에 맞게 양수만 전달하도록 확인
      const bizPoint = Math.max(0, newValue);
      await updateIssueBizpoint(editableIssue.id, bizPoint);
      setEditableIssue({ ...editableIssue, storyPoints: bizPoint });
      if (onUpdate) {
        onUpdate({ ...editableIssue, storyPoints: bizPoint });
      }
    } catch (err) {
      console.error('Error updating story points:', err);
      setError('스토리 포인트 업데이트 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 담당자 업데이트
  const handleAssigneeChange = async (newAssigneeId: string) => {
    if (!editableIssue) return;
    setLoading(true);
    setError(null);
    
    try {
      // 빈 값은 null로 전달 (담당자 할당 안함)
      const assigneeIdForApi = newAssigneeId || null;
      await updateIssueAssignee(editableIssue.id, assigneeIdForApi);
      
      // 담당자 이름 찾기
      let assigneeName = '';
      if (newAssigneeId) {
        const selectedMember = members.find(member => member.id === newAssigneeId);
        assigneeName = selectedMember ? selectedMember.nickname : '';
      }
      
      setEditableIssue({ ...editableIssue, assignee: assigneeName });
      if (onUpdate) {
        onUpdate({ ...editableIssue, assignee: assigneeName });
      }
    } catch (err) {
      console.error('Error updating assignee:', err);
      setError('담당자 업데이트 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  // 컴포넌트 업데이트
  const handleComponentChange = async (newComponentId: string) => {
    if (!editableIssue) return;
    setLoading(true);
    setError(null);
    
    try {
      // 비어있는 값을 null로 전달 (아무 컴포넌트도 할당하지 않음)
      const componentIdForApi = newComponentId || null;
      await updateIssueComponent(editableIssue.id, componentIdForApi);
      
      // 컴포넌트 이름 찾기
      let componentName = '';
      if (newComponentId) {
        const selectedComponent = components.find(comp => comp.id === newComponentId);
        componentName = selectedComponent ? selectedComponent.name : '';
      }
      
      // 상태 업데이트
      setEditableIssue({ ...editableIssue, component: componentName });
      if (onUpdate) {
        onUpdate({ ...editableIssue, component: componentName });
      }
    } catch (err) {
      console.error('Error updating component:', err);
      setError('컴포넌트 업데이트 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  // 에픽 업데이트
  const handleEpicChange = async (newEpicId: string) => {
    if (!editableIssue) return;
    setLoading(true);
    setError(null);
    
    try {
      // 빈 값은 null로 전달 (에픽 할당 안함)
      const epicIdForApi = newEpicId || null;
      await updateIssueEpic(editableIssue.id, epicIdForApi);
      
      // 에픽 이름 찾기
      let epicName = '';
      if (newEpicId) {
        const selectedEpic = epics.find(epic => epic.id === newEpicId);
        epicName = selectedEpic ? selectedEpic.name : '';
      }
      
      setEditableIssue({ ...editableIssue, epic: epicName });
      if (onUpdate) {
        onUpdate({ ...editableIssue, epic: epicName });
      }
    } catch (err) {
      console.error('Error updating epic:', err);
      setError('에픽 업데이트 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  // 스프린트 업데이트
  const handleSprintChange = async (newSprintId: string) => {
    if (!editableIssue) return;
    setLoading(true);
    setError(null);
    
    try {
      // 빈 값은 null로 전달 (스프린트 할당 안함)
      const sprintIdForApi = newSprintId || null;
      await updateIssueSprint(editableIssue.id, sprintIdForApi);
      
      // 스프린트 이름 찾기
      let sprintName = '';
      if (newSprintId) {
        const selectedSprint = sprints.find(sprint => sprint.id === newSprintId);
        sprintName = selectedSprint ? selectedSprint.name : '';
      }
      
      setEditableIssue({ ...editableIssue, sprint: sprintName });
      if (onUpdate) {
        onUpdate({ ...editableIssue, sprint: sprintName });
      }
    } catch (err) {
      console.error('Error updating sprint:', err);
      setError('스프린트 업데이트 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 상태 라벨 매핑
  const statusLabels = {
    UNASSIGNED: '진행 상황',
    TODO: '해야 할 일',
    IN_PROGRESS: '진행 중',
    DONE: '완료',
  };
  
  // 우선순위 라벨 매핑
  const priorityLabels = {
    low: '낮음',
    medium: '중간',
    high: '높음',
  };

  // UI에 사용할 API 상태 매핑
  const apiIssueStatus = editableIssue.status === 'todo' ? 'TODO' : 
                  editableIssue.status === 'inProgress' ? 'IN_PROGRESS' : 'DONE';
  
  const apiIssueImportance = editableIssue.priority === 'high' ? 'HIGH' : 
                      editableIssue.priority === 'medium' ? 'MEDIUM' : 'LOW';

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/30'
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className='relative flex max-h-[90vh] w-full max-w-3xl flex-col gap-4 overflow-y-auto rounded-2xl bg-white shadow-2xl'>
        {/* 상태별 컬러 바 */}
        <div
          className={clsx('h-2 w-full rounded-t-2xl', {
            'bg-gray-300': editableIssue.status === 'todo',
            'bg-blue-400': editableIssue.status === 'inProgress',
            'bg-green-400': editableIssue.status === 'done',
          })}
        />
        
        {/* 닫기 버튼 */}
        <button
          className='absolute right-4 top-4 p-1 text-gray-500 hover:text-gray-700'
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* 헤더 */}
        <div className='px-8 pt-7 pb-2'>
          <div className='flex flex-col gap-2'>
            <span className='inline-flex w-fit items-center gap-1 rounded-sm bg-gray-100 px-2 py-0.5 text-xs text-gray-600'>
              <Hash size={14} /> {editableIssue.key}
            </span>

            {isEditing.title ? (
              <div className='flex flex-1 items-center gap-2'>
                <input
                  value={editableIssue.title}
                  onChange={handleNameChange}
                  className='border-b border-gray-300 px-2 py-1 text-xl font-bold outline-none transition-colors focus:border-gray-500'
                  autoFocus
                />
                <button
                  className='rounded-full bg-blue-500 p-1 text-white hover:bg-blue-600'
                  onClick={() => {
                    onSubmitName();
                    setIsEditing({ ...isEditing, title: false });
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </button>
                <button
                  className='rounded-full border border-red-500 p-1 text-red-500 hover:bg-red-50'
                  onClick={() => {
                    if (issue) setEditableIssue({ ...editableIssue, title: issue.title });
                    setIsEditing({ ...isEditing, title: false });
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <h2
                className='flex w-fit items-center rounded-md border-b border-transparent px-2 py-1 text-xl font-bold transition-colors hover:bg-gray-100'
                onClick={() => setIsEditing({ ...isEditing, title: true })}
              >
                {editableIssue.title}
              </h2>
            )}
          </div>

          {loading && <div className='text-blue-600'>로딩 중...</div>}
          {error && <div className='text-red-600'>{error}</div>}

          {/* 태그 요약 */}
          <div className='relative mt-3 flex flex-wrap gap-2'>
            {/* 상태 */}
            <Tag
              ref={statusRef}
              name='진행 상황'
              value={apiIssueStatus}
              className={clsx({
                'bg-gray-100 text-gray-700': editableIssue.status === 'todo',
                'bg-blue-100 text-blue-700': editableIssue.status === 'inProgress',
                'bg-green-100 text-green-700': editableIssue.status === 'done',
              })}
              onClick={() => {
                setEditField('status');
              }}
            >
              <Flag size={14} />
              {statusLabels[apiIssueStatus as keyof typeof statusLabels]}
            </Tag>

            {/* 우선순위 */}
            <Tag
              ref={priorityRef}
              name='우선순위'
              value={apiIssueImportance}
              className={clsx({
                'bg-blue-100 text-blue-800': editableIssue.priority === 'low',
                'bg-yellow-100 text-yellow-800': editableIssue.priority === 'medium',
                'bg-red-100 text-red-800': editableIssue.priority === 'high',
              })}
              onClick={() => {
                setEditField('priority');
              }}
            >
              <Layers size={14} />
              {priorityLabels[editableIssue.priority]}
            </Tag>

            {/* 스토리포인트 */}
            <Tag
              ref={storyPointsRef}
              name='비즈포인트'
              value={editableIssue.storyPoints}
              onClick={() => {
                setEditField('storyPoints');
              }}
            >
              <Briefcase size={14} />
              {editableIssue.storyPoints ?? '없음'}
            </Tag>

            {/* 담당자 */}
            <Tag
              ref={assigneeRef}
              name='담당자'
              value={editableIssue.assignee}
              onClick={() => {
                setEditField('assignee');
              }}
            >
              <User size={14} />
              {editableIssue.assignee || '없음'}
            </Tag>

            {/* 컴포넌트 */}
            <Tag
              ref={componentRef}
              name='컴포넌트'
              value={editableIssue.component}
              onClick={() => {
                setEditField('component');
              }}
            >
              <Layers size={14} />
              {editableIssue.component || '없음'}
            </Tag>

            {/* 에픽 */}
            <Tag
              ref={epicRef}
              name='에픽'
              value={editableIssue.epic}
              onClick={() => {
                setEditField('epic');
              }}
            >
              <Layers size={14} />
              {editableIssue.epic || '없음'}
            </Tag>

            {/* 스프린트 */}
            <Tag
              ref={sprintRef}
              name='스프린트'
              value={editableIssue.sprint || null}
              onClick={() => {
                setEditField('sprint');
              }}
              errorMessage={editableIssue.sprint && '완료된 스프린트로는 이동할 수 없습니다.'}
            >
              <Layers size={14} />
              {editableIssue.sprint || '없음'}
            </Tag>

            {/* 드롭다운 메뉴 렌더링 */}
            {editField === 'status' && (
              <DropDownMenu
                anchorRef={statusRef}
                options={[
                  { label: '해야 할 일', value: 'TODO' },
                  { label: '진행 중', value: 'IN_PROGRESS' },
                  { label: '완료', value: 'DONE' },
                ]}
                value={apiIssueStatus}
                onSelect={(v) => {
                  handleIssueStatusChange(v as string);
                  setEditField(null);
                }}
                onClose={() => setEditField(null)}
              />
            )}

            {editField === 'priority' && (
              <DropDownMenu
                anchorRef={priorityRef}
                options={[
                  { label: '높음', value: 'HIGH' },
                  { label: '중간', value: 'MEDIUM' },
                  { label: '낮음', value: 'LOW' },
                ]}
                value={apiIssueImportance}
                onSelect={(v) => {
                  handleIssueImportanceChange({ target: { value: v as string } });
                  setEditField(null);
                }}
                onClose={() => setEditField(null)}
              />
            )}

            {editField === 'assignee' && (
              <DropDownMenu
                anchorRef={assigneeRef}
                options={[
                  { label: '없음', value: '' },
                  ...members.map(member => ({ label: member.nickname, value: member.id }))
                ]}
                value={editableIssue.assignee || ''}
                onSelect={(v) => {
                  handleAssigneeChange(v as string);
                  setEditField(null);
                }}
                onClose={() => setEditField(null)}
              />
            )}
            
            {editField === 'storyPoints' && (
              <PopoverInput
                anchorRef={storyPointsRef}
                value={editableIssue.storyPoints}
                onSave={(v) => {
                  handleBizPointChange(v);
                  setEditField(null);
                }}
                onClose={() => setEditField(null)}
              />
            )}
            
            {editField === 'component' && (
              <DropDownMenu
                anchorRef={componentRef}
                options={[
                  { label: '없음', value: '' },
                  ...components.map(c => ({ label: c.name, value: c.id }))
                ]}
                value={editableIssue.component}
                onSelect={(v) => {
                  handleComponentChange(v as string);
                  setEditField(null);
                }}
                onClose={() => setEditField(null)}
              />
            )}
            
            {editField === 'epic' && (
              <DropDownMenu
                anchorRef={epicRef}
                options={[
                  { label: '없음', value: '' },
                  ...epics.map(e => ({ label: e.name, value: e.id }))
                ]}
                value={editableIssue.epic}
                onSelect={(v) => {
                  handleEpicChange(v as string);
                  setEditField(null);
                }}
                onClose={() => setEditField(null)}
              />
            )}
            
            {editField === 'sprint' && (
              <DropDownMenu
                anchorRef={sprintRef}
                options={[
                  { label: '없음', value: '' },
                  ...sprints
                    .filter(s => s.status !== 'COMPLETED') // 완료된 스프린트는 선택할 수 없음
                    .map(s => ({ 
                      label: `${s.name} (${s.status === 'ONGOING' ? '진행 중' : '준비됨'})`, 
                      value: s.id 
                    }))
                ]}
                value={editableIssue.sprint || ''}
                onSelect={(v) => {
                  handleSprintChange(v as string);
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
              <button
                onClick={() => setIsEditing({ ...isEditing, description: true })}
                className='ml-1 text-gray-400 hover:text-gray-600'
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
              </button>
            </div>
            {isEditing.description ? (
              <div className='flex flex-col gap-2'>
                <textarea
                  value={editableIssue.description || ''}
                  onChange={handleContentChange}
                  className='min-h-[120px] w-full rounded border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'
                />
                <div className='flex justify-end gap-2'>
                  <button
                    className='rounded-md bg-blue-500 px-3 py-1 text-sm font-medium text-white hover:bg-blue-600'
                    onClick={onSubmitContent}
                  >
                    저장
                  </button>
                  <button
                    className='rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100'
                    onClick={() => {
                      if (issue) setEditableIssue({ ...editableIssue, description: issue.description });
                      setIsEditing({ ...isEditing, description: false });
                    }}
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <div className='min-h-[80px] rounded-md bg-white p-3 text-sm text-gray-700'>
                {editableIssue.description || '설명이 없습니다.'}
              </div>
            )}
          </div>
        </div>

        {/* 하단 버튼 */}
        {onDelete && (
          <div className='flex justify-end px-8 pb-6'>
            <button
              onClick={handleDelete}
              className='rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600'
              disabled={loading}
            >
              삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
};