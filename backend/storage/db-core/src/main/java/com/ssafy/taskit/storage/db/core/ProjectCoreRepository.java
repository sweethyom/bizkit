package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.NewProject;
import com.ssafy.taskit.domain.Project;
import com.ssafy.taskit.domain.ProjectRepository;
import com.ssafy.taskit.domain.User;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class ProjectCoreRepository implements ProjectRepository {

  private final ProjectJpaRepository projectJpaRepository;

  public ProjectCoreRepository(ProjectJpaRepository projectJpaRepository) {
    this.projectJpaRepository = projectJpaRepository;
  }

  @Override
  public Project save(User user, NewProject newProject, String imageUrl, int currentSequence) {
    return projectJpaRepository
        .save(new ProjectEntity(
            user.id(), newProject.name(), newProject.key(), imageUrl, currentSequence))
        .toProject();
  }

  @Override
  public Optional<Project> findByKey(String key) {
    return projectJpaRepository.findByKey(key).map(ProjectEntity::toProject);
  }

  @Override
  public List<Project> findByUser(User user) {
    return projectJpaRepository.findByUserId(user.id()).stream()
        .map(ProjectEntity::toProject)
        .toList();
  }
}
