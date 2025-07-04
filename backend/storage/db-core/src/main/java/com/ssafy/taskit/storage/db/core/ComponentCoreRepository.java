package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.Component;
import com.ssafy.taskit.domain.ComponentRepository;
import com.ssafy.taskit.domain.ModifyComponentContent;
import com.ssafy.taskit.domain.ModifyComponentName;
import com.ssafy.taskit.domain.NewComponent;
import com.ssafy.taskit.domain.User;
import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class ComponentCoreRepository implements ComponentRepository {

  private final ComponentJpaRepository componentJpaRepository;

  public ComponentCoreRepository(ComponentJpaRepository componentJpaRepository) {
    this.componentJpaRepository = componentJpaRepository;
  }

  @Override
  public Component save(User user, Long projectId, NewComponent newComponent) {
    return componentJpaRepository
        .save(
            new ComponentEntity(projectId, user.id(), newComponent.name(), newComponent.content()))
        .toComponent();
  }

  @Override
  public Optional<Component> findByProjectIdAndName(Long projectId, String name) {
    return componentJpaRepository
        .findByProjectIdAndName(projectId, name)
        .map(ComponentEntity::toComponent);
  }

  @Override
  public List<Component> findComponents(Long projectId) {
    List<ComponentEntity> componentEntities =
        componentJpaRepository.findAllByProjectIdAndEntityStatus(projectId, EntityStatus.ACTIVE);
    return componentEntities.stream().map(ComponentEntity::toComponent).toList();
  }

  @Override
  public Optional<Component> findById(Long componentId) {
    return componentJpaRepository
        .findByIdAndEntityStatus(componentId, EntityStatus.ACTIVE)
        .map(ComponentEntity::toComponent);
  }

  @Transactional
  @Override
  public void modifyComponentName(Long componentId, ModifyComponentName modifyComponentName) {
    ComponentEntity componentEntity = componentJpaRepository
        .findByIdAndEntityStatus(componentId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.COMPONENT_NOT_FOUND));
    componentEntity.updateComponentName(modifyComponentName.name());
  }

  @Transactional
  @Override
  public void modifyComponentContent(
      Long componentId, ModifyComponentContent modifyComponentContent) {
    ComponentEntity componentEntity = componentJpaRepository
        .findByIdAndEntityStatus(componentId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.COMPONENT_NOT_FOUND));
    componentEntity.updateComponentContent(modifyComponentContent.content());
  }

  @Override
  public void deleteComponent(Long componentId) {
    componentJpaRepository
        .findByIdAndEntityStatus(componentId, EntityStatus.ACTIVE)
        .ifPresent(entity -> {
          entity.delete();
          componentJpaRepository.save(entity);
        });
  }

  @Override
  public boolean existsByIdAndProjectId(Long componentId, Long projectId) {
    return componentJpaRepository.existsByIdAndProjectId(componentId, projectId);
  }

  @Override
  public boolean existsByProjectIdAndName(Long projectId, String name) {
    return componentJpaRepository.existsByProjectIdAndName(projectId, name);
  }

  @Override
  public List<Component> findAllByIds(List<Long> componentIds) {
    return componentJpaRepository
        .findAllByIdInAndEntityStatus(componentIds, EntityStatus.ACTIVE)
        .stream()
        .map(ComponentEntity::toComponent)
        .toList();
  }
}
