package com.ssafy.taskit.domain;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ProjectService {

  private final ProjectAppender projectAppender;
  private final ProjectReader projectReader;
  private final ProjectModifier projectModifier;
  private final ProjectDeleter projectDeleter;
  private final MemberValidator memberValidator;
  private final ProjectValidator projectValidator;

  public ProjectService(
      ProjectAppender projectAppender,
      ProjectReader projectReader,
      ProjectModifier projectModifier,
      ProjectDeleter projectDeleter,
      MemberValidator memberValidator,
      ProjectValidator projectValidator) {
    this.projectAppender = projectAppender;
    this.projectReader = projectReader;
    this.projectModifier = projectModifier;
    this.projectDeleter = projectDeleter;
    this.memberValidator = memberValidator;
    this.projectValidator = projectValidator;
  }

  public Long append(User user, NewProject newProject) {
    Project project = projectAppender.append(user, newProject);

    return project.id();
  }

  public List<Project> findProjects(User user, ProjectSort sortType) {
    return projectReader.readProjectsByRecentView(user, sortType);
  }

  public ProjectDetail findProject(User user, Long projectId) {
    boolean isLeader = memberValidator.checkProjectLeader(user, projectId);
    return projectReader.readProject(user, projectId, isLeader);
  }

  public ProjectDetail modifyProjectName(User user, Long projectId, String name) {
    memberValidator.isProjectLeader(user, projectId);
    boolean isLeader = memberValidator.checkProjectLeader(user, projectId);
    return projectModifier.modifyProjectName(projectId, name, isLeader);
  }

  public Long deleteProject(User user, Long projectId) {
    memberValidator.isProjectLeader(user, projectId);
    return projectDeleter.deleteProject(projectId);
  }
}
