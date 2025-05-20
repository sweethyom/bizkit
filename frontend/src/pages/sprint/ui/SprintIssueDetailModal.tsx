import { Issue } from '@/pages/sprint/model/types';
import { useIssueModalStore } from '@/widgets/issue-detail-modal';
import { IssueDetailModal as BaseIssueDetailModal } from '@/widgets/issue-detail-modal';
import { Button } from '@/shared/ui';
import { X } from 'lucide-react';
import { useCallback, useEffect, useState, useRef } from 'react';

interface SprintIssueDetailModalProps {
  isOpen: boolean;
  selectedIssue: Issue | null;
  onClose: () => void;
  onDelete: (issueId: string) => void;
  onUpdate: (issue: Issue) => void;
}

export const SprintIssueDetailModal: React.FC<SprintIssueDetailModalProps> = ({
  isOpen,
  selectedIssue,
  onClose,
  onDelete,
  onUpdate,
}) => {
  const { openModal, closeModal } = useIssueModalStore();

  // 모달 상태 추적을 위한 플래그
  const [hasOpened, setHasOpened] = useState(false);
  const [isIntentionalClose, setIsIntentionalClose] = useState(false);

  // 위젯 store의 이슈 모달 상태 감시
  const { isOpen: isWidgetModalOpen, issue: widgetIssue } = useIssueModalStore();

  // selectedIssue가 변경되면 위젯 모달 상태 업데이트
  useEffect(() => {
    // 이슈가 있고 모달이 열릴 때만 위젯 모달 열기
    if (isOpen && selectedIssue && !hasOpened) {
      console.log('Opening widget modal with issue:', selectedIssue.id);
      // 모달이 이미 열렸음을 표시
      setHasOpened(true);
      setIsIntentionalClose(false);

      // 위젯 모달 열기
      openModal(selectedIssue as any);
    }
  }, [isOpen, selectedIssue, openModal, hasOpened]);

  // 래퍼 모달이 의도적으로 닫혔을 때 widgets 모달도 닫기
  useEffect(() => {
    if (!isOpen && hasOpened) {
      console.log('Wrapper modal closed, closing widget modal');
      setIsIntentionalClose(true);
      closeModal();
      setHasOpened(false);
    }
  }, [isOpen, hasOpened, closeModal]);

  // 이전 이슈 상태를 추적하기 위한 ref
  const prevIssueRef = useRef<Issue | null>(null);

  // 이슈 업데이트 이벤트 감지
  useEffect(() => {
    if (
      widgetIssue && 
      selectedIssue && 
      widgetIssue.id === selectedIssue.id && 
      hasOpened && 
      // 실제 데이터가 변경되었는지 확인 (문자열 비교로 deep comparison)
      (!prevIssueRef.current || JSON.stringify(widgetIssue) !== JSON.stringify(prevIssueRef.current))
    ) {
      // 현재 상태 저장
      prevIssueRef.current = widgetIssue as Issue;
      // 위젯 모달에서 이슈가 업데이트되면 부모 컴포넌트에 알림
      onUpdate(widgetIssue as any);
    }
  }, [widgetIssue, selectedIssue, onUpdate, hasOpened]);

  // 위젯 모달 닫힐 때 감지 - 의도적인 닫기가 아닐 때만 래퍼도 닫기
  useEffect(() => {
    // 위젯 모달이 닫히고 래퍼 모달이 열려있고, 의도적인 닫기가 아닐 때만 실행
    if (!isWidgetModalOpen && isOpen && hasOpened && !isIntentionalClose) {
      console.log('Widget modal closed unexpectedly, closing wrapper modal');
      onClose();
    }
  }, [isWidgetModalOpen, isOpen, onClose, hasOpened, isIntentionalClose]);

  // 이슈 삭제 처리
  const handleDelete = useCallback(() => {
    if (selectedIssue) {
      setIsIntentionalClose(true);
      onDelete(selectedIssue.id);
      onClose();
    }
  }, [selectedIssue, onDelete, onClose]);

  if (!isOpen || !selectedIssue) return null;

  return (
    <>
      {/* 위젯 모달 사용 */}
      <BaseIssueDetailModal />

      {/* 삭제 버튼 추가 */}
      {isWidgetModalOpen && widgetIssue && (
        <div className='fixed right-8 bottom-8 z-[60]'>
          <Button 
            color='warning' 
            variant='solid' 
            onClick={handleDelete} 
            className='shadow-lg flex items-center gap-1'
          >
            <X size={18} />
            이슈 삭제
          </Button>
        </div>
      )}
    </>
  );
};