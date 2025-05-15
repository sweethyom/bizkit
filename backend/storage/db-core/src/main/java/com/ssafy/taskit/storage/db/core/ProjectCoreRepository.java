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
          case RECENT_VIEW -> Sort.by(Sort.Direction.DESC, "lastAccessedAt");
        };

    return projectJpaRepository.findProjectIdsByUserId(user.id(), sort);
  }

  @Override
  public ProjectDetail findProject(User user, Long id, boolean isLeader) {
    ProjectEntity projectEntity = projectJpaRepository
        .findById(id)
        .orElseThrow(() -> new CoreException(CoreErrorType.PROJECT_NOT_EXIST));
    return projectEntity.toProjectDetail(isLeader);
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

  @Override
  public ProjectDetail modifyProjectName(Long projectId, String name, boolean isLeader) {
    ProjectEntity projectEntity = projectJpaRepository
        .findById(projectId)
        .orElseThrow(() -> new CoreException(CoreErrorType.DATA_NOT_FOUND));
    projectEntity.changeName(name);
    projectJpaRepository.save(projectEntity);
    return projectEntity.toProjectDetail(isLeader);
  }

  @Override
  public void modifyProjectImage(Long projectId, String imageUrl, boolean isLeader) {
    ProjectEntity projectEntity = projectJpaRepository
        .findById(projectId)
        .orElseThrow(() -> new CoreException(CoreErrorType.DATA_NOT_FOUND));
    projectEntity.changeImageUrl(imageUrl);
    projectJpaRepository.save(projectEntity);
    projectEntity.toProjectDetail(isLeader);
  }

  @Transactional
  @Override
  public void deleteProject(Long projectId) {
    Optional<ProjectEntity> optionalEntity = projectJpaRepository.findById(projectId);
    if (optionalEntity.isEmpty()) {
      throw new CoreException(CoreErrorType.PROJECT_NOT_EXIST);
    }
    ProjectEntity projectEntity = optionalEntity.get();
    projectEntity.delete();
  }
}
