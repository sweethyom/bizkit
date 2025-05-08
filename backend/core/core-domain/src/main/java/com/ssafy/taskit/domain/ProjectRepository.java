package com.ssafy.taskit.domain;

public interface ProjectRepository {

  Project save(User user, NewProject newProject, String image);

  //    List<Project> findProjects();

}
