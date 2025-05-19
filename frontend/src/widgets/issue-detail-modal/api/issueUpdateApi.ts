// entities에서 API 함수 가져오기
import {
  updateIssueName as updateIssueNameEntity,
  updateIssueContent as updateIssueContentEntity,
  updateIssueAssignee as updateIssueAssigneeEntity,
  updateIssueComponent as updateIssueComponentEntity,
  updateIssueBizPoint as updateIssueBizPointEntity,
  updateIssueImportance as updateIssueImportanceEntity,
  updateIssueEpic as updateIssueEpicEntity,
  updateIssueStatus as updateIssueStatusEntity
} from '@/entities/issue';

export const updateIssueName = async (issueId: number, name: string) => {
  try {
    // entities의 함수 사용
    return await updateIssueNameEntity(issueId, name);
  } catch (error) {
    console.error('Error updating issue name:', error);
    throw error;
  }
};

export const updateIssueContent = async (issueId: number, content: string) => {
  try {
    console.log('API call - updateIssueContent:', issueId, content);
    // entities의 함수 사용
    return await updateIssueContentEntity(issueId, content);
  } catch (error) {
    console.error('Error updating issue content:', error);
    throw error;
  }
};

export const updateIssueAssignee = async (issueId: number, assigneeId: number) => {
  try {
    // entities의 함수 사용
    return await updateIssueAssigneeEntity(issueId, assigneeId);
  } catch (error) {
    console.error('Error updating issue assignee:', error);
    throw error;
  }
};

export const updateIssueComponent = async (issueId: number, componentId: number) => {
  try {
    // entities의 함수 사용
    return await updateIssueComponentEntity(issueId, componentId);
  } catch (error) {
    console.error('Error updating issue component:', error);
    throw error;
  }
};

export const updateIssueBizPoint = async (issueId: number, bizPoint: number) => {
  try {
    console.log('API call - updateIssueBizPoint:', issueId, bizPoint);
    // entities의 함수 사용
    return await updateIssueBizPointEntity(issueId, bizPoint);
  } catch (error) {
    console.error('Error updating issue bizpoint:', error);
    throw error;
  }
};

export const updateIssueImportance = async (issueId: number, issueImportance: 'HIGH' | 'LOW') => {
  try {
    // entities의 함수 사용
    return await updateIssueImportanceEntity(issueId, issueImportance);
  } catch (error) {
    console.error('Error updating issue importance:', error);
    throw error;
  }
};

export const updateIssueEpic = async (issueId: number, epicId: number) => {
  try {
    // entities의 함수 사용
    return await updateIssueEpicEntity(issueId, epicId);
  } catch (error) {
    console.error('Error updating issue epic:', error);
    throw error;
  }
};

export const updateIssueStatus = async (
  issueId: number,
  issueStatus: 'TODO' | 'IN_PROGRESS' | 'DONE',
) => {
  try {
    // entities의 함수 사용
    return await updateIssueStatusEntity(issueId, issueStatus);
  } catch (error) {
    console.error('Error updating issue status:', error);
    throw error;
  }
};
