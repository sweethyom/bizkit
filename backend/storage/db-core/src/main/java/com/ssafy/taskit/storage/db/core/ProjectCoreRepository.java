package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.NewProject;
import com.ssafy.taskit.domain.Project;
import com.ssafy.taskit.domain.ProjectRepository;
import org.springframework.stereotype.Repository;

@Repository
public class ProjectCoreRepository implements ProjectRepository {

  private final ProjectJpaRepository projectJpaRepository;

  public ProjectCoreRepository(ProjectJpaRepository projectJpaRepository) {
    this.projectJpaRepository = projectJpaRepository;
  }

  @Override
  public Project save(NewProject newProject, String imageUrl) {
    return projectJpaRepository
        .save(new ProjectEntity(newProject.name(), imageUrl))
        .toProject();
  }
}
