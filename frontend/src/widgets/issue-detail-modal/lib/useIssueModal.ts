import { getIssueDetail, IssueImportance, IssueStatus, useIssueStore } from '@/entities/issue';

import {
  Member,
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

import { Component } from '@/entities/component';
import { Epic } from '@/entities/epic';
import { getByteSize } from '@/shared/lib';
import { useCallback, useEffect, useState } from 'react';

export const useIssueModal = () => {
  const { issue } = useIssueModalStore();
  const updateIssue = useIssueStore((state) => state.updateIssue);
  const moveIssue = useIssueStore((state) => state.moveIssue);

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
    if (!issue || getByteSize(e.target.value) > 40) return;

    setName(e.target.value);
  };

  const onSubmitName = async () => {
    if (!issue || !name.trim() || getByteSize(name) > 40) return;

    if (name.trim() === issue.name.trim()) {
      setName(issue.name.trim());
      return;
    }

    try {
      await updateIssueName(issue.id, name);

      issue.name = name.trim();
      updateIssue(issue);
      setName(issue.name.trim());
    } catch (error) {
      console.error('Error in onSubmitName:', error);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const onSubmitContent = async () => {
    if (!issue) return;

    if (content.trim() === issue.content?.trim()) {
      setContent(issue.content.trim() ?? '');
      return;
    }

    try {
      await updateIssueContent(issue.id, content.trim());

      issue.content = content.trim();
      updateIssue(issue);
      setContent(issue.content.trim());
    } catch (error) {
      console.error('Error in onSubmitContent:', error);
    }
  };

  const handleAssigneeChange = async (members: Member[], assigneeId: number) => {
    if (!issue || assigneeId === issue.assignee?.id) return;

    try {
      await updateIssueAssignee(issue.id, assigneeId);

      // 현재 store에서 이슈를 가져옴
      const state = useIssueStore.getState();
      const currentIssue =
        state.issues.sprint[issue.sprint?.id || 0]?.find((i) => i.id === issue.id) ||
        state.issues.epic[issue.epic?.id || 0]?.find((i) => i.id === issue.id) ||
        issue; // fallback

      // members에서 assignee 정보 생성
      const targetMember = members.find((member) => member.userId === assigneeId);

      const assignee = {
        id: targetMember?.userId || null,
        nickname: targetMember?.nickname || '',
        profileImgUrl: targetMember?.profileImage || '',
      };

      // 기존 이슈 정보에 assignee만 덮어쓰기
      const updatedIssue = {
        ...currentIssue,
        assignee,
        user: assignee, // 필요시
      };

      updateIssue(updatedIssue);
      setAssignee(assignee);
    } catch (error) {
      console.error('Error in handleAssigneeChange:', error);
    }
  };

  const handleIssueStatusChange = async (issueStatus: IssueStatus) => {
    if (!issue || issueStatus === issue.issueStatus || issueStatus === 'UNASSIGNED') return;

    try {
      await updateIssueStatus(issue.id, issueStatus);

      issue.issueStatus = issueStatus;
      updateIssue(issue);
      setIssueStatus(issueStatus);
    } catch (error) {
      console.error('Error in handleIssueStatusChange:', error);
    }
  };

  const handleIssueImportanceChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!issue || e.target.value === issue.issueImportance) return;

    try {
      await updateIssueImportance(issue.id, e.target.value as 'LOW' | 'HIGH');

      issue.issueImportance = e.target.value as 'LOW' | 'HIGH';
      updateIssue(issue);
      setIssueImportance(e.target.value as 'LOW' | 'HIGH');
    } catch (error) {
      console.error('Error in handleIssueImportanceChange:', error);
    }
  };

  const handleBizPointChange = async (bizPoint: number) => {
    if (!issue || bizPoint === issue.bizPoint) return;

    try {
      await updateIssueBizPoint(issue.id, bizPoint);

      issue.bizPoint = bizPoint;
      updateIssue(issue);
      setBizPoint(bizPoint);
    } catch (error) {
      console.error('Error in handleBizPointChange:', error);
    }
  };

  const handleComponentChange = async (components: Component[], componentId: number) => {
    if (!issue || componentId === issue.component?.id) return;

    try {
      await updateIssueComponent(issue.id, componentId);

      issue.component = components.find((component) => component.id === componentId);
      updateIssue(issue);
      setComponent(issue.component);
    } catch (error) {
      console.error('Error in handleComponentChange:', error);
    }
  };

  const handleEpicChange = async (epics: Epic[], epicId: number) => {
    if (!issue || epicId === issue.epic?.id) return;

    try {
      await updateIssueEpic(issue.id, epicId);

      moveIssue(
        issue.id,
        { type: 'epic', id: issue.epic?.id || 0, index: 0 },
        { type: 'epic', id: epicId, index: 0 },
      );

      const fromEpic = epics.find((epic) => epic.id === issue.epic?.id);
      const toEpic = epics.find((epic) => epic.id === epicId);

      if (fromEpic) {
        fromEpic.cntTotalIssues -= 1;
        fromEpic.cntRemainIssues -= 1;
      }

      if (toEpic) {
        toEpic.cntTotalIssues += 1;
        toEpic.cntRemainIssues += 1;
      }

      issue.epic = toEpic;
      updateIssue(issue);
      setEpic(toEpic);
    } catch (error) {
      console.error('Error in handleEpicChange:', error);
    }
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
