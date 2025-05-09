package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.Component;
import com.ssafy.taskit.domain.ComponentRepository;
import com.ssafy.taskit.domain.NewComponent;
import com.ssafy.taskit.domain.User;
import java.util.List;
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
}
