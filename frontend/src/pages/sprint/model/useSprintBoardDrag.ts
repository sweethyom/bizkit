import { moveIssue } from '@/pages/sprint/api/issueApi';
import { findActiveSprintId, getOngoingSprintComponentIssues } from '@/pages/sprint/api/sprintApi';
import { Issue, SprintData } from '@/pages/sprint/model/types';
import { DropResult } from '@hello-pangea/dnd';
import { useCallback } from 'react';
import { transformApiResponseToSprintData } from '../lib/transformers';

/**
 * 스프린트 보드 드래그 앤 드롭 관련 훅
 */
export const useSprintBoardDrag = (
  sprintData: SprintData | null,
  updateIssueCallback: ((issue: Issue) => void) | null,
  setSprintData: ((data: SprintData) => void) | null,
  projectId?: string,
) => {
  const onDragEnd = useCallback(
    async (result: DropResult) => {
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
          const sourceIdParts = source.droppableId.split('-');
          const destIdParts = destination.droppableId.split('-');

          // 값이 없거나 형식이 잘못된 경우 처리
          if (sourceIdParts.length < 2 || destIdParts.length < 2) {
            return;
          }

          const sourceStatusId = sourceIdParts[0];
          // 첫 번째 - 이후의 모든 부분을 componentId로 사용 (중간에 - 가 포함될 수 있음)
          const sourceComponentId = sourceIdParts.slice(1).join('-');

          const destStatusId = destIdParts[0];
          const destComponentId = destIdParts.slice(1).join('-');

          // 스프린트 데이터 복사
          const newSprintData = { ...sprintData };

          // 소스 상태 그룹과 컴포넌트 그룹 찾기
          const sourceStatusGroup = newSprintData.statusGroups.find(
            (group) => group.id === sourceStatusId,
          );

          if (!sourceStatusGroup) {
            return;
          }

          const sourceComponentGroup = sourceStatusGroup.componentGroups.find(
            (group) => group.id === sourceComponentId,
          );

          if (!sourceComponentGroup) {
            return;
          }

          if (!sourceComponentGroup.issues || !Array.isArray(sourceComponentGroup.issues)) {
            return;
          }

          // 이슈 찾아서 제거
          if (source.index >= sourceComponentGroup.issues.length) {
            return;
          }

          const [movedIssue] = sourceComponentGroup.issues.splice(source.index, 1);

          if (!movedIssue) {
            return;
          }

          // 목적지 상태 그룹 찾기
          const destStatusGroup = newSprintData.statusGroups.find(
            (group) => group.id === destStatusId,
          );

          if (!destStatusGroup) {
            return;
          }

          const destComponentGroup = destStatusGroup.componentGroups.find(
            (group) => group.id === destComponentId,
          );

          if (!destComponentGroup) {
            return;
          }

          // 상태나 컴포넌트 변경 여부 확인
          const statusChanged = sourceStatusId !== destStatusId;
          const componentChanged = sourceComponentId !== destComponentId;

          // 위치에 변화가 있는지 확인 - 동일 상태와 컴포넌트 그룹 내에서도 인덱스가 변경되면 순서 변경으로 찄
          const positionChanged =
            source.index !== destination.index || statusChanged || componentChanged;

          // 위치 변경이 있다면 API 호출 진행
          if (positionChanged) {
            // 상태 변경이 있는 경우
            if (statusChanged) {
              movedIssue.status = destStatusId as 'todo' | 'inProgress' | 'done';
            }

            // 컴포넌트 변경이 있는 경우
            if (componentChanged) {
              movedIssue.component = destComponentGroup.name;
            }

            // 현재 스프린트 ID 가져오기 - 활성 스프린트 ID 확인
            let currentSprintId: string | null = null;

            try {
              if (projectId) {
                currentSprintId = await findActiveSprintId(projectId);
                console.log(`[useSprintBoardDrag] 활성 스프린트 ID: ${currentSprintId}`);
              }
            } catch (error) {
              console.error('[useSprintBoardDrag] 활성 스프린트 ID 가져오기 실패:', error);
              // 실패 시 프로젝트 ID를 임시 사용
              currentSprintId = projectId;
            }

            // 스프린트 ID가 없는 경우 프로젝트 ID 사용 (백업)
            if (!currentSprintId && projectId) {
              currentSprintId = projectId;
              console.log(
                `[useSprintBoardDrag] 활성 스프린트 ID가 없어 프로젝트 ID 사용: ${currentSprintId}`,
              );
            }

            // 순서 정보 처리
            // 이전 이슈와 이후 이슈의 position 값 계산
            let beforePosition = null;
            let afterPosition = null;

            // 이전 이슈와 이후 이슈 찾기 (순서 간격 계산을 위해)
            if (
              destination.index > 0 &&
              destComponentGroup.issues &&
              destComponentGroup.issues.length > 0
            ) {
              // 이전 이슈가 있는 경우 (처음이 아닌 경우)
              const prevIssue = destComponentGroup.issues[destination.index - 1];
              beforePosition = prevIssue.position || 1000 * destination.index;
              console.log(`[순서계산] 이전 이슈:`, prevIssue);
            }

            if (
              destination.index < destComponentGroup.issues?.length &&
              destComponentGroup.issues &&
              destComponentGroup.issues.length > 0
            ) {
              // 이후 이슈가 있는 경우 (마지막이 아닌 경우)
              const nextIssue = destComponentGroup.issues[destination.index];
              afterPosition = nextIssue.position || 1000 * (destination.index + 1);
              console.log(`[순서계산] 이후 이슈:`, nextIssue);
            }

            // position 값이 없는 경우를 위한 기본 값 계산 - 같은 상태 내 이동을 위해 중요
            if (beforePosition === null && afterPosition === null) {
              // 이슈가 하나도 없는 경우 기본값 설정
              beforePosition = 0;
              afterPosition = 2000;
            } else if (beforePosition === null) {
              // 처음에 이슈를 넣는 경우
              beforePosition = 0;
            } else if (afterPosition === null) {
              // 마지막에 이슈를 넣는 경우
              afterPosition = beforePosition + 2000;
            }

            console.log(`[순서계산] 계산된 위치 - 이전: ${beforePosition}, 이후: ${afterPosition}`);

            // 만약 position 값이 없으면 간격을 두고 새로운 position 값 계산
            let newPosition = beforePosition;
            if (beforePosition !== null && afterPosition !== null) {
              newPosition = beforePosition + (afterPosition - beforePosition) / 2;
              console.log(`[순서계산] 새 이슈 위치 값: ${newPosition}`);
            }

            // 이동한 이슈에 position 값 설정
            movedIssue.position = newPosition;

            try {
              if (!currentSprintId) {
                throw new Error('활성 스프린트 ID를 찾을 수 없습니다.');
              }

              await moveIssue(
                currentSprintId, // 현재 스프린트 ID
                movedIssue.id, // 이동할 이슈 ID
                statusChanged ? convertStatusFormat(movedIssue.status) : undefined, // 변경된 상태 값 (포맷 변환)
                componentChanged ? destComponentId : undefined, // 변경된 컴포넌트 ID
                beforePosition, // 이전 이슈 위치
                afterPosition, // 이후 이슈 위치
              );

              // 성공 후 즉시 데이터 갱신 호출 (setTimeout 대신 직접 호출)
              await refreshData(setSprintData, projectId);
            } catch (err) {
              console.error('이슈 이동 실패:', err);
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
    },
    [sprintData, setSprintData, updateIssueCallback, projectId],
  );

  // 데이터 갱신을 위한 별도 함수
  const refreshData = async (
    setSprintData: ((data: SprintData) => void) | null,
    projectId?: string,
  ) => {
    // 서버에서 최신 데이터를 즉시 가져오기 (지연 없음)
    try {
      if (!setSprintData) return;

      try {
        // 우선 getOngoingSprintComponentIssues API 사용 시도
        const refreshedComponentIssueGroups = await getOngoingSprintComponentIssues(projectId);

        if (refreshedComponentIssueGroups && refreshedComponentIssueGroups.length > 0) {
          // 데이터 변환 및 업데이트
          const convertedData = transformApiResponseToSprintData(refreshedComponentIssueGroups);
          setSprintData(convertedData);
        }
      } catch (ongoingApiError) {
        console.error('Error with ongoing sprint API during refresh:', ongoingApiError);
      }
    } catch (refreshError) {
      console.error('스프린트 데이터 새로고침 실패:', refreshError);
    }
  };

  // 상태 포맷 변환 함수 - 프론트엔드 형식에서 API 형식으로 변환
  const convertStatusFormat = (
    status: 'todo' | 'inProgress' | 'done',
  ): 'TODO' | 'IN_PROGRESS' | 'DONE' => {
    const statusMap: Record<string, 'TODO' | 'IN_PROGRESS' | 'DONE'> = {
      todo: 'TODO',
      inProgress: 'IN_PROGRESS',
      done: 'DONE',
    };
    return statusMap[status];
  };

  return {
    onDragEnd,
  };
};
