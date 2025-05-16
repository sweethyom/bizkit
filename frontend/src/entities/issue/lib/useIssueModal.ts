import { useState } from 'react';
import { Issue, IssueStatus } from '../model/issue';

export const useIssueModal = (issue: Issue) => {
  const [name, setName] = useState(issue.name);
  const [content, setContent] = useState(issue.content);
  const [assignee, setAssignee] = useState(issue.assignee);
  const [issueStatus, setIssueStatus] = useState(issue.issueStatus);
  const [issueImportance, setIssueImportance] = useState(issue.issueImportance);
  const [bizPoint, setBizPoint] = useState(issue.bizPoint);
  const [component, setComponent] = useState(issue.component);
  const [epic, setEpic] = useState(issue.epic);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  const handleAssigneeChange = (assigneeId: number) => {
    // setAssignee(assigneeId);
    console.log(assigneeId);
  };

  const handleIssueStatusChange = (issueStatus: IssueStatus) => {
    setIssueStatus(issueStatus);
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIssueImportance(e.target.value);
  };

  const handleBizPointChange = (bizPoint: number) => {
    setBizPoint(bizPoint);
  };

  const handleComponentChange = (componentId: number) => {
    // setComponent(componentId);
    console.log(componentId);
  };

  const handleEpicChange = (epicId: number) => {
    // setEpic(epicId);
    console.log(epicId);
  };

  return {
    name,
    content,
    assignee,
    issueStatus,
    priority: issueImportance,
    bizPoint,
    component,
    epic,
    handleNameChange,
    handleContentChange,
    handleAssigneeChange,
    handleIssueStatusChange,
    handlePriorityChange,
    handleBizPointChange,
    handleComponentChange,
    handleEpicChange,
  };
};
