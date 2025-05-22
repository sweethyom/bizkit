package com.ssafy.taskit.domain;

import java.util.List;
import java.util.Optional;

public interface ComponentRepository {

  Component save(User user, Long projectId, NewComponent component);

  Optional<Component> findByProjectIdAndName(Long projectId, String name);

  List<Component> findComponents(Long projectId);

  /**
   * ID로 활성 상태의 컴포넌트를 조회합니다.
   *
   * @param componentId 컴포넌트 ID
   * @return 조회된 컴포넌트
   */
  Optional<Component> findById(Long componentId);

  void deleteComponent(Long componentId);

  void modifyComponentName(Long componentId, ModifyComponentName modifyComponentName);

  void modifyComponentContent(Long componentId, ModifyComponentContent modifyComponentContent);

  boolean existsByIdAndProjectId(Long componentId, Long projectId);

  List<Component> findAllByIds(List<Long> componentIds);

  boolean existsByProjectIdAndName(Long projectId, String name);
}
