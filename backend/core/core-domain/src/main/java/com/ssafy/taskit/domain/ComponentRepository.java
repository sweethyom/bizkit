package com.ssafy.taskit.domain;

public interface ComponentRepository {

  Component save(User user, Long projectId, NewComponent component);

  boolean existsByProjectIdAndName(Long projectId, String name);
}
