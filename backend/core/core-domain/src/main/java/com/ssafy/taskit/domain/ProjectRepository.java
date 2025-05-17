package com.ssafy.taskit.domain;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository {

  Project save(User user, NewProject newProject, String imageUrl, int currentSequence);

  Optional<Project> findByKey(String key);

  List<Project> findAllByIds(List<Long> projectIds);

  List<Long> findUserProjectIds(User user, ProjectSort sortType);

  ProjectDetail findProject(User user, Long id, boolean isLeader);

  Project findById(Long projectId);

  void update(Project project);

  ProjectDetail modifyProjectName(Long projectId, String name, boolean isLeader);

  void modifyProjectImage(Long projectId, String imageUrl, boolean isLeader);

  void deleteProject(Long projectId);

  boolean existProject(Long projectId);

  List<Project> findProjectsNextPage(List<Long> projectIds, Long cursorId, Integer PageSize);

  List<Project> findProjectsFirstPage(List<Long> projectIds, Integer pageSize);
}
