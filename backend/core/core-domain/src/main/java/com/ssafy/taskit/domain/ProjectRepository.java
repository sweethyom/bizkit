package com.ssafy.taskit.domain;

import java.time.LocalDateTime;
import java.util.Optional;

public interface ProjectRepository {

  Project save(User user, NewProject newProject, String imageUrl, LocalDateTime viewedAt);

  Optional<Project> findByKey(String key);

  //    List<Project> findProjects();

}
