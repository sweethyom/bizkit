import { getIssueDetail, IssueImportance, IssueStatus } from '@/entities/issue';

import {
  updateIssueAssignee,
  updateIssueBizPoint,
  updateIssueComponent,
  updateIssueContent,
  updateIssueEpic,
  updateIssueImportance,
  updateIssueName,
  updateIssueStatus,
} from '@/widgets/issue-detail-modal';

import { useIssueModalStore } from './useIssueModalStore';

import { useCallback, useEffect, useState } from 'react';

export const useIssueModal = () => {
  const { issue } = useIssueModalStore();

  const [key, setKey] = useState(issue?.key ?? '');
  const [name, setName] = useState(issue?.name ?? '로드 중...');
  const [content, setContent] = useState(issue?.content ?? '');
  const [assignee, setAssignee] = useState<any>(issue?.assignee ?? null);
  const [issueStatus, setIssueStatus] = useState<IssueStatus>(issue?.issueStatus ?? 'UNASSIGNED');
  const [issueImportance, setIssueImportance] = useState<IssueImportance | null>(
    issue?.issueImportance ?? null,
  );
  const [bizPoint, setBizPoint] = useState(issue?.bizPoint ?? 0);
  const [component, setComponent] = useState<any>(issue?.component ?? null);
  const [epic, setEpic] = useState<any>(issue?.epic ?? null);
  const [sprint, setSprint] = useState<any>(issue?.sprint ?? null);

  const getIssue = useCallback(async () => {
    if (!issue) return;

    const response = await getIssueDetail(issue.id);

    if (response.data) {
      setKey(response.data.key);
      setName(response.data.name);
      setContent(response.data.content ?? '');
      setAssignee(response.data.assignee);
      setIssueStatus(response.data.issueStatus ?? 'UNASSIGNED');
      setIssueImportance(response.data.issueImportance ?? null);
      setBizPoint(response.data.bizPoint ?? 0);
      setComponent(response.data.component);
      setEpic(response.data.epic);
      setSprint(response.data.sprint);
    }
  }, [issue]);

  useEffect(() => {
    getIssue();
  }, [issue, getIssue]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!issue) return;

    setName(e.target.value);
  };

  const onSubmitName = async () => {
    if (!issue) return;

    const response = await updateIssueName(issue.id, name);
    console.warn('이름 변경 시 issueStore 업데이트 필요');
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  const onSubmitContent = async () => {
    if (!issue) return;

    const response = await updateIssueContent(issue.id, content);
    console.warn('내용 변경 시 issueStore 업데이트 필요');
  };

  const handleAssigneeChange = async (assigneeId: number) => {
    if (!issue) return;

    const response = await updateIssueAssignee(issue.id, assigneeId);
    console.warn('담당자 변경 시 issueStore 업데이트 필요');
  };

  const handleIssueStatusChange = async (issueStatus: IssueStatus) => {
    if (!issue) return;

    if (issueStatus === 'UNASSIGNED') return;

    const response = await updateIssueStatus(issue.id, issueStatus);
    setIssueStatus(issueStatus);
    console.warn('상태 변경 시 issueStore 업데이트 필요');
  };

  const handleIssueImportanceChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!issue) return;

    const response = await updateIssueImportance(issue.id, e.target.value as 'LOW' | 'HIGH');
    setIssueImportance(e.target.value as 'LOW' | 'HIGH');
    console.warn('중요도 변경 시 issueStore 업데이트 필요');
  };

  const handleBizPointChange = async (bizPoint: number) => {
    if (!issue) return;

    const response = await updateIssueBizPoint(issue.id, bizPoint);
    setBizPoint(bizPoint);
    console.warn('비즈 포인트 변경 시 issueStore 업데이트 필요');
  };

  const handleComponentChange = async (componentId: number) => {
    if (!issue) return;

    const response = await updateIssueComponent(issue.id, componentId);
    console.warn('컴포넌트 변경 시 issueStore 업데이트 필요');
  };

  const handleEpicChange = async (epicId: number) => {
    if (!issue) return;

    const response = await updateIssueEpic(issue.id, epicId);
    console.warn('에픽 변경 시 issueStore 업데이트 필요');
  };

  return {
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
  };
};
