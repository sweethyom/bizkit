package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.*;
import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

    return projectJpaRepository.findProjectIdsByUserIdAndMemberStatusAndProjectStatus(
        user.id(), EntityStatus.ACTIVE, EntityStatus.ACTIVE, sort);
  }

  @Override
  public ProjectDetail findProject(User user, Long id, boolean isLeader) {
    ProjectEntity projectEntity = projectJpaRepository
        .findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.PROJECT_NOT_FOUND));
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
        .findByIdAndEntityStatus(project.id(), EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.DATA_NOT_FOUND));
    projectEntity.updateSequence(project.currentSequence());
  }

  @Override
  public ProjectDetail modifyProjectName(Long projectId, String name, boolean isLeader) {
    ProjectEntity projectEntity = projectJpaRepository
        .findByIdAndEntityStatus(projectId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.DATA_NOT_FOUND));
    projectEntity.changeName(name);
    projectJpaRepository.save(projectEntity);
    return projectEntity.toProjectDetail(isLeader);
  }

  @Override
  public void modifyProjectImage(Long projectId, String imageUrl, boolean isLeader) {
    ProjectEntity projectEntity = projectJpaRepository
        .findByIdAndEntityStatus(projectId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.DATA_NOT_FOUND));
    projectEntity.changeImageUrl(imageUrl);
    projectJpaRepository.save(projectEntity);
    projectEntity.toProjectDetail(isLeader);
  }

  @Transactional
  @Override
  public void deleteProject(Long projectId) {
    Optional<ProjectEntity> optionalEntity =
        projectJpaRepository.findByIdAndEntityStatus(projectId, EntityStatus.ACTIVE);
    if (optionalEntity.isEmpty()) {
      throw new CoreException(CoreErrorType.PROJECT_NOT_FOUND);
    }
    ProjectEntity projectEntity = optionalEntity.get();
    projectEntity.delete();
  }

  @Override
  public boolean existProject(Long projectId) {
    return projectJpaRepository.existsByIdAndEntityStatus(projectId, EntityStatus.ACTIVE);
  }

  @Override
  public List<Project> findProjectsNextPage(
      List<Long> projectIds, Long cursorId, Integer pageSize) {
    ProjectEntity lastProject = projectJpaRepository
        .findById(cursorId)
        .orElseThrow(() -> new CoreException(CoreErrorType.PROJECT_NOT_FOUND));
    LocalDateTime cursorUpdatedAt = lastProject.getUpdatedAt();

    Pageable pageable = PageRequest.of(0, pageSize);
    List<ProjectEntity> projectEntities = projectJpaRepository.findMyProjectsAfterCursor(
        projectIds, EntityStatus.ACTIVE, cursorUpdatedAt, cursorId, pageable);
    return projectEntities.stream().map(ProjectEntity::toProject).toList();
  }

  @Override
  public List<Project> findProjectsFirstPage(List<Long> projectIds, Integer pageSize) {
    Pageable pageable =
        PageRequest.of(0, pageSize, Sort.by(Sort.Direction.DESC, "updatedAt", "id"));
    List<ProjectEntity> entities =
        projectJpaRepository.findMyProjectsFirstPage(projectIds, pageable);
    return entities.stream().map(ProjectEntity::toProject).toList();
  }
}
