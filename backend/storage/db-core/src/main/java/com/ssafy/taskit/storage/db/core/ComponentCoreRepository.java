package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.Component;
import com.ssafy.taskit.domain.ComponentRepository;
import com.ssafy.taskit.domain.ModifyComponent;
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
  public boolean existsByProjectIdAndName(Long projectId, String name) {
    return componentJpaRepository.existsByProjectIdAndName(projectId, name);
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
        .findByComponentIdAndEntityStatus(componentId, EntityStatus.ACTIVE)
        .map(ComponentEntity::toComponent);
  }

  @Transactional
  @Override
  public void modifyComponent(Long componentId, ModifyComponent modifyComponent) {
    ComponentEntity componentEntity = componentJpaRepository
        .findByComponentIdAndEntityStatus(componentId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.COMPONENT_NOT_FOUND));
    componentEntity.updateComponentName(modifyComponent.name());
    componentEntity.updateComponentContent(modifyComponent.content());
  }

  @Override
  public Optional<Component> deleteComponent(Long componentId) {
    return componentJpaRepository
        .findByComponentIdAndEntityStatus(componentId, EntityStatus.ACTIVE)
        .map(entity -> {
          entity.delete();
          return entity.toComponent();
        });

  @Override
  public boolean existsByIdAndProjectId(Long componentId, Long projectId) {
    return componentJpaRepository.existsByIdAndProjectId(componentId, projectId);
  }
  
}
