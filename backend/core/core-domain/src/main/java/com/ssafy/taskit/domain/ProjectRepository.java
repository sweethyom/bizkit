package com.ssafy.taskit.domain;

import java.util.Optional;

public interface ProjectRepository {

  Project save(User user, NewProject newProject, String image);

  Optional<Project> findByKey(String key);

  //    List<Project> findProjects();

}
