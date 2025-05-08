package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.NewProject;
import com.ssafy.taskit.domain.Project;
import com.ssafy.taskit.domain.ProjectRepository;
import com.ssafy.taskit.domain.User;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class ProjectCoreRepository implements ProjectRepository {

  private final ProjectJpaRepository projectJpaRepository;

  public ProjectCoreRepository(ProjectJpaRepository projectJpaRepository) {
    this.projectJpaRepository = projectJpaRepository;
  }

  @Override
  public Project save(User user, NewProject newProject, String imageUrl) {
    return projectJpaRepository
        .save(new ProjectEntity(user.id(), newProject.name(), newProject.key(), imageUrl))
        .toProject();
  }

  @Override
  public Optional<Project> findByKey(String key) {
    return projectJpaRepository.findByKey(key).map(ProjectEntity::toProject);
  }
}
