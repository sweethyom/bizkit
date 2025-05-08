package com.ssafy.taskit.domain;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository {

  Project save(User user, NewProject newProject, String imageUrl, int currentSequence);

  Optional<Project> findByKey(String key);

  List<Project> findByUser(User user);

  //    List<Project> findProjects();
}
