// import { Sprint } from '@/shared/model';
// import { ConfirmModal } from '@/shared/ui';

// export const DeleteSprintModal = ({
//   sprint,
//   onDelete,
// }: {
//   sprint: Sprint;
//   onDelete: () => void;
// }) => {
//   const handleDeleteSprint = async () => {
//     if (!deleteSprint) return;

//     try {
//       await sprintApi.deleteSprint(deleteSprint.id);

//       issues.sprint[deleteSprint.id]?.forEach((issue) => {
//         if (!issue.epic?.id) return;

//         const epic = epics.find((e) => e.id === issue.epic?.id);
//         if (!epic) return;

//         epic.cntTotalIssues -= 1;
//       });

//       setSprints(sprints.filter((s) => s.id !== deleteSprint.id));
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setShowDeleteSprintModal(false);
//       setDeleteSprint(null);
//     }
//   };

//   return (
//     <ConfirmModal
//       title='스프린트 삭제'
//       description='해당 스프린트에 할당된 모든 이슈가 삭제됩니다.'
//       onConfirm={() => handleDeleteSprint()}
//       onCancel={() => setShowDeleteSprintModal(false)}
//     />
//   );
// };
