package com.ssafy.taskit.domain;

public interface ComponentRepository {

  Component save(Long projectId, NewComponent component);

  boolean existsByProjectIdAndName(Long projectId, String name);
}
