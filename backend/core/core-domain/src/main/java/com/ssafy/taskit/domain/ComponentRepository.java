package com.ssafy.taskit.domain;

import java.util.List;
import java.util.Optional;

public interface ComponentRepository {

  Component save(User user, Long projectId, NewComponent component);

  boolean existsByProjectIdAndName(Long projectId, String name);

  List<Component> findComponents(Long projectId);

  /**
   * ID로 활성 상태의 컴포넌트를 조회합니다.
   *
   * @param componentId 컴포넌트 ID
   * @return 조회된 컴포넌트
   */
  Optional<Component> findById(Long componentId);

  Optional<Component> deleteComponent(Long componentId);

  void modifyComponent(Long componentId, ModifyComponent modifyComponent);

  boolean existsByIdAndProjectId(Long componentId, Long projectId);
}
