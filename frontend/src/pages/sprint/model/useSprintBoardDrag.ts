import { useCallback } from 'react';
import { DropResult } from '@hello-pangea/dnd';
import { SprintData, Issue } from '@/pages/sprint/model/types';
import { getOngoingSprintComponentIssues } from '@/pages/sprint/api/sprintApi';
import { updateIssueStatus, updateIssueComponent } from '@/pages/sprint/api/issueApi';
import { transformApiResponseToSprintData } from '../lib/transformers';

/**
 * 스프린트 보드 드래그 앤 드롭 관련 훅
 */
export const useSprintBoardDrag = (
  sprintData: SprintData | null, 
  updateIssueCallback: ((issue: Issue) => void) | null,
  setSprintData: ((data: SprintData) => void) | null,
  projectId?: string
) => {
  const onDragEnd = useCallback(async (result: DropResult) => {
    // sprintData, updateIssueCallback, setSprintData가 모두 존재하는지 확인
    if (!sprintData || !updateIssueCallback || !setSprintData) {
      return; // 필요한 값이 없으면 아무 작업도 하지 않음
    }

    const { source, destination, type } = result;

    // 드롭이 취소된 경우
    if (!destination) return;

    // 같은 위치에 드롭된 경우
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    if (type === 'ISSUE') {
      try {
        // 분석: source.droppableId 형식은 'statusId-componentId'
        const sourceIdParts = source.droppableId.split('-');
        const destIdParts = destination.droppableId.split('-');
        
        // 값이 없거나 형식이 잘못된 경우 처리
        if (sourceIdParts.length < 2 || destIdParts.length < 2) {
          console.error(`Invalid droppableId format. Source: ${source.droppableId}, Destination: ${destination.droppableId}`);
          return;
        }
        
        const sourceStatusId = sourceIdParts[0];
        // 첫 번째 - 이후의 모든 부분을 componentId로 사용 (중간에 - 가 포함될 수 있음)
        const sourceComponentId = sourceIdParts.slice(1).join('-');
        
        const destStatusId = destIdParts[0];
        const destComponentId = destIdParts.slice(1).join('-');
        
        console.log(`Source: status=${sourceStatusId}, component=${sourceComponentId}`);
        console.log(`Destination: status=${destStatusId}, component=${destComponentId}`);

        // 스프린트 데이터 복사
        const newSprintData = { ...sprintData };

        // 소스 상태 그룹과 컴포넌트 그룹 찾기
        const sourceStatusGroup = newSprintData.statusGroups.find(
          (group) => group.id === sourceStatusId,
        );

        if (!sourceStatusGroup) {
          console.error(`Status group not found: ${sourceStatusId}`);
          return;
        }

        // 컴포넌트 그룹 찾기 및 로깅
        console.log(`Looking for source component ID: ${sourceComponentId}`);
        console.log(`Available component IDs in ${sourceStatusId}:`, 
          sourceStatusGroup.componentGroups.map(group => `${group.id} (${group.name})`));
        
        const sourceComponentGroup = sourceStatusGroup.componentGroups.find(
          (group) => group.id === sourceComponentId,
        );

        if (!sourceComponentGroup) {
          console.error(`Component group not found in source: ${sourceComponentId}`);
          return;
        }

        if (!sourceComponentGroup.issues || !Array.isArray(sourceComponentGroup.issues)) {
          console.error('Source component group has no issues array:', sourceComponentGroup);
          return;
        }

        // 이슈 찾아서 제거
        if (source.index >= sourceComponentGroup.issues.length) {
          console.error(
            `Invalid source index: ${source.index}, issues length: ${sourceComponentGroup.issues.length}`,
          );
          return;
        }

        const [movedIssue] = sourceComponentGroup.issues.splice(source.index, 1);

        if (!movedIssue) {
          console.error('Failed to extract moved issue');
          return;
        }

        // 목적지가 다른 상태로 이동한 경우 이슈 상태도 업데이트
        if (sourceStatusId !== destStatusId) {
          movedIssue.status = destStatusId as 'todo' | 'inProgress' | 'done';

          // API 호출
          try {
            await updateIssueStatus(movedIssue.id, movedIssue.status);
          } catch (err) {
            console.error('이슈 상태 업데이트 실패:', err);
          }
        }

        // 목적지 상태 그룹 찾기
        const destStatusGroup = newSprintData.statusGroups.find(
          (group) => group.id === destStatusId,
        );

        if (!destStatusGroup) {
          console.error(`Destination status group not found: ${destStatusId}`);
          return;
        }

        // 컴포넌트 ID 관련 로깅
        console.log(`Looking for destination component ID: ${destComponentId}`);
        console.log(`Available component IDs in ${destStatusId}:`, 
          destStatusGroup.componentGroups.map(group => `${group.id} (${group.name})`));
        
        const destComponentGroup = destStatusGroup.componentGroups.find(
          (group) => group.id === destComponentId,
        );

        if (!destComponentGroup) {
          console.error(`Destination component group not found: ${destComponentId}`);
          return;
        }

        // 목적지가 다른 컴포넌트로 이동한 경우 컴포넌트도 업데이트
        if (sourceComponentId !== destComponentId) {
          // 컴포넌트 이름 업데이트
          movedIssue.component = destComponentGroup.name;

          // API 호출
          try {
            await updateIssueComponent(movedIssue.id, destComponentId);
          } catch (err) {
            console.error('이슈 컴포넌트 업데이트 실패:', err);
          }
        }

        if (!destComponentGroup.issues || !Array.isArray(destComponentGroup.issues)) {
          console.error('Destination component group has no issues array:', destComponentGroup);
          destComponentGroup.issues = [];
        }

        // 목적지에 이슈 추가
        destComponentGroup.issues.splice(destination.index, 0, movedIssue);

        // 상태 업데이트
        setSprintData(newSprintData);

        // 이슈 업데이트 콜백 호출
        updateIssueCallback(movedIssue);

        // 데이터 갱신 요청
        refreshData(setSprintData, projectId);
        
      } catch (error) {
        console.error('드래그 앤 드롭 처리 중 오류 발생:', error);
      }
    }
  }, [sprintData, setSprintData, updateIssueCallback, projectId]);

  // 데이터 갱신을 위한 별도 함수
  const refreshData = async (
    setSprintData: ((data: SprintData) => void) | null,
    projectId?: string
  ) => {
    // DnD 작업이 성공적으로 완료되면, 서버에서 최신 데이터를 다시 가져오기
    setTimeout(async () => {
      try {
        console.log('Refreshing data after drag and drop');
        if (!setSprintData) return;
        
        try {
          // 우선 getOngoingSprintComponentIssues API 사용 시도
          const refreshedComponentIssueGroups = await getOngoingSprintComponentIssues(projectId);
          
          if (refreshedComponentIssueGroups && refreshedComponentIssueGroups.length > 0) {
            // 데이터 변환 및 업데이트
            const convertedData = transformApiResponseToSprintData(refreshedComponentIssueGroups);
            setSprintData(convertedData);
            console.log('Data refreshed successfully with ongoing sprint API');
          } else {
            console.log('No data from ongoing sprint API during refresh');
          }
        } catch (ongoingApiError) {
          console.error('Error with ongoing sprint API during refresh:', ongoingApiError);
        }
      } catch (refreshError) {
        console.error('스프린트 데이터 새로고침 실패:', refreshError);
      }
    }, 500); // 서버 업데이트에 약간의 지연 후 데이터 가져오기
  };

  return {
    onDragEnd
  };
};