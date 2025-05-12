package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.*;
import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Sort;
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
  public List<Project> findAllByIds(List<Long> ids) {
    return projectJpaRepository.findAllById(ids).stream()
        .map(ProjectEntity::toProject)
        .toList();
  }

  @Override
  public List<Long> findUserProjectIds(User user, ProjectSort sortType) {
    Sort sort =
        switch (sortType) {
          case RECENT_VIEW -> Sort.by(Sort.Direction.DESC, "member.lastViewedAt");
        };

    return projectJpaRepository.findProjectIdsByUserId(user, sort);
  }

  @Override
  public Project findById(Long projectId) {
    return projectJpaRepository
        .findByIdAndEntityStatus(projectId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.DATA_NOT_FOUND))
        .toProject();
  }

  @Override
  @Transactional
  public void update(Project project) {
    ProjectEntity projectEntity = projectJpaRepository
        .findById(project.id())
        .orElseThrow(() -> new CoreException(CoreErrorType.DATA_NOT_FOUND));
    projectEntity.updateSequence(project.currentSequence());
  }
}
