import { moveIssue } from '@/pages/sprint/api/issueApi';
import { findActiveSprintId } from '@/pages/sprint/api/sprintApi';
import { Issue, SprintData } from '@/pages/sprint/model/types';
import { DropResult } from '@hello-pangea/dnd';
import { useCallback } from 'react';

/**
 * 스프린트 보드 드래그 앤 드롭 관련 훅 - 간소화된 버전
 * 낙관적 UI 업데이트를 사용하고 불필요한 새로고침을 제거함
 */
export const useSprintBoardDrag = (
  sprintData: SprintData | null,
  updateIssueCallback: ((issue: Issue) => void) | null,
  setSprintData: ((data: SprintData) => void) | null,
  projectId?: string,
) => {
  /**
   * 드래그 앤 드롭 완료 처리 함수
   */
  const onDragEnd = useCallback(
    async (result: DropResult) => {
      // 필수 데이터 검증
      if (!sprintData || !updateIssueCallback || !setSprintData || !projectId) {
        return;
      }

      const { source, destination, type } = result;

      // 드롭이 취소되었거나 같은 위치에 드롭된 경우
      if (
        !destination ||
        (source.droppableId === destination.droppableId && source.index === destination.index)
      ) {
        return;
      }

      // 이슈 드래그 처리
      if (type === 'ISSUE') {
        try {
          // droppableId 형식: '{status}-{componentId}'
          const sourceIdParts = source.droppableId.split('-');
          const destIdParts = destination.droppableId.split('-');

          // ID 파트 검증
          if (sourceIdParts.length < 2 || destIdParts.length < 2) {
            return;
          }

          // 소스/대상 상태 및 컴포넌트 ID 추출
          const sourceStatusId = sourceIdParts[0]; // 'todo', 'inProgress', 'done'
          const sourceComponentId = sourceIdParts.slice(1).join('-');
          const destStatusId = destIdParts[0];
          const destComponentId = destIdParts.slice(1).join('-');

          // UI 데이터 조작을 위한 복사본 생성
          const newSprintData = { ...sprintData };

          // 활성 스프린트 ID 가져오기
          let activeSprintId = sprintData.sprintId;
          
          // 스프린트 ID가 없으면 활성 스프린트 찾기 시도
          if (!activeSprintId) {
            try {
              activeSprintId = await findActiveSprintId(projectId);
              
              if (!activeSprintId) {
                return;
              }
              
              // sprintData 객체에 스프린트 ID 설정
              newSprintData.sprintId = activeSprintId;
            } catch (error) {
              return;
            }
          }

          // 소스 그룹 찾기
          const sourceStatusGroup = newSprintData.statusGroups.find(
            (group) => group.id === sourceStatusId,
          );
          if (!sourceStatusGroup) {
            return;
          }

          const sourceComponentGroup = sourceStatusGroup.componentGroups.find(
            (group) => group.id === sourceComponentId,
          );
          if (!sourceComponentGroup || !sourceComponentGroup.issues) {
            return;
          }

          // 대상 그룹 찾기
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

          if (!destComponentGroup.issues) {
            destComponentGroup.issues = [];
          }

          // 인덱스 검증
          if (source.index >= sourceComponentGroup.issues.length) {
            return;
          }

          // 이슈 이동
          const [movedIssue] = sourceComponentGroup.issues.splice(source.index, 1);

          // 상태 변경 감지
          const statusChanged = sourceStatusId !== destStatusId;
          const componentChanged = sourceComponentId !== destComponentId;

          // 필요한 이슈 속성 업데이트
          if (statusChanged) {
            movedIssue.status = destStatusId as 'todo' | 'inProgress' | 'done';
          }

          if (componentChanged) {
            movedIssue.component = destComponentGroup.name;
          }

          // 대상 위치에 이슈 추가 (낙관적 UI 업데이트)
          destComponentGroup.issues.splice(destination.index, 0, movedIssue);

          // UI 상태 즉시 업데이트 - 낙관적 업데이트
          setSprintData(newSprintData);
          updateIssueCallback(movedIssue);

          // 위치 계산을 위한 변수
          let beforePosition: number | null = null;
          let afterPosition: number | null = null;

          // 이전 이슈 position (첫 번째가 아닌 경우)
          if (destination.index > 0) {
            const prevIssue = destComponentGroup.issues[destination.index - 1];
            beforePosition = typeof prevIssue.position === 'number' ? prevIssue.position : null;
          }

          // 이후 이슈 position (마지막이 아닌 경우)
          if (destination.index < destComponentGroup.issues.length - 1) {
            const nextIssue = destComponentGroup.issues[destination.index + 1];
            afterPosition = typeof nextIssue.position === 'number' ? nextIssue.position : null;
          }

          // Position이 없는 경우 기본값 설정
          if (beforePosition === null && afterPosition === null) {
            // 첫 번째 이슈인 경우
            if (destination.index === 0) {
              afterPosition = 100;
            }
            // 마지막 이슈인 경우
            else if (destination.index === destComponentGroup.issues.length - 1) {
              beforePosition = destComponentGroup.issues.length * 100;
            }
            // 중간에 있는 이슈인 경우 (이론적으로 이 조건은 도달하지 않아야 함)
            else {
              beforePosition = destination.index * 100;
              afterPosition = (destination.index + 1) * 100;
            }
          }

          // API 제공 형식으로 상태 변환
          const apiStatus = statusChanged ? convertStatusFormat(movedIssue.status) : undefined;

          // API 호출로 서버에 이슈 이동 반영 (백그라운드에서 실행)
          // 실패해도 UI는 이미 업데이트되어 있으므로 새로고침 불필요
          moveIssue(
            activeSprintId,
            movedIssue.id,
            apiStatus,
            componentChanged ? destComponentId : undefined,
            beforePosition,
            afterPosition,
          ).catch(error => {
            console.error('이슈 이동 중 오류 발생:', error);
            // 오류가 발생해도 낙관적 UI 업데이트는 그대로 유지
            // 심각한 오류인 경우 사용자에게 알림을 표시할 수 있음
          });
        } catch (error) {
          console.error('드래그 앤 드롭 처리 오류:', error);
        }
      }
    },
    [sprintData, setSprintData, updateIssueCallback, projectId],
  );

  /**
   * 상태 포맷 변환 함수 - 프론트엔드 형식에서 API 형식으로 변환
   */
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
