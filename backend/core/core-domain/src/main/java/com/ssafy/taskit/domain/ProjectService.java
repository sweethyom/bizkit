package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectService {

  private final ProjectAppender projectAppender;
  private final ProjectReader projectReader;
  private final ProjectModifier projectModifier;
  private final ProjectDeleter projectDeleter;
  private final MemberValidator memberValidator;
  private final InvitationValidator invitationValidator;
  private final ProjectValidator projectValidator;
  private final MemberAppender memberAppender;

  public ProjectService(
      ProjectAppender projectAppender,
      ProjectReader projectReader,
      ProjectModifier projectModifier,
      ProjectDeleter projectDeleter,
      MemberValidator memberValidator,
      InvitationValidator invitationValidator,
      ProjectValidator projectValidator,
      MemberAppender memberAppender) {
    this.projectAppender = projectAppender;
    this.projectReader = projectReader;
    this.projectModifier = projectModifier;
    this.projectDeleter = projectDeleter;
    this.memberValidator = memberValidator;
    this.invitationValidator = invitationValidator;
    this.projectValidator = projectValidator;
    this.memberAppender = memberAppender;
  }

  @Transactional
  public Long append(User user, NewProject newProject) {
    Project project = projectAppender.append(user, newProject);
    memberAppender.appendLeader(user, project);
    return project.id();
  }

  public List<Project> findProjects(
      User user, ProjectSort sortType, Long cursorId, Integer pageSize) {
    if (pageSize <= 0) {
      throw new CoreException(CoreErrorType.PAGE_SIZE_NOT_VALID);
    }
    if (cursorId == null) {
      return projectReader.readProjectsFirstPageByRecentView(user, sortType, pageSize);
    }
    return projectReader.readProjectsByRecentView(user, sortType, cursorId, pageSize);
  }

  public ProjectDetail findProject(User user, Long projectId) {
    projectValidator.isProjectExists(projectId);
    memberValidator.validateMember(user.id(), projectId);
    boolean isLeader = memberValidator.checkProjectLeader(user, projectId);
    return projectReader.readProject(user, projectId, isLeader);
  }

  public ProjectDetail modifyProjectName(User user, Long projectId, String name) {
    memberValidator.isProjectLeader(user, projectId);
    boolean isLeader = memberValidator.checkProjectLeader(user, projectId);
    return projectModifier.modifyProjectName(projectId, name, isLeader);
  }

  public void modifyProjectImage(User user, Long projectId, String imageUrl) {
    memberValidator.isProjectLeader(user, projectId);
    boolean isLeader = memberValidator.checkProjectLeader(user, projectId);
    projectModifier.modifyProjectImage(projectId, imageUrl, isLeader);
  }

  public void deleteProject(User user, Long projectId) {
    memberValidator.isProjectLeader(user, projectId);
    projectDeleter.deleteProject(projectId);
  }

  public Project findInvitationProject(User user, String invitationCode) {
    invitationValidator.isInvitedMember(user, invitationCode);
    return projectReader.findInvitationProject(user, invitationCode);
  }

  public Map<Long, Project> mapByIds(List<Long> projectIds) {
    if (projectIds.isEmpty()) {
      return Collections.emptyMap();
    }
    List<Project> projects = projectReader.readProjects(projectIds);
    return projects.stream().collect(Collectors.toMap(Project::id, Function.identity()));
  }
}
