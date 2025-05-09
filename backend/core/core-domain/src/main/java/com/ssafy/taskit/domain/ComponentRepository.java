package com.ssafy.taskit.domain;

import java.util.List;

public interface ComponentRepository {

  Component save(User user, Long projectId, NewComponent component);

  boolean existsByProjectIdAndName(Long projectId, String name);

  List<Component> findComponents(Long projectId);
}
