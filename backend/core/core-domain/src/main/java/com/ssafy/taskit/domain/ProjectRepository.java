package com.ssafy.taskit.domain;

public interface ProjectRepository {

  Project save(NewProject newProject, String image);

  //    List<Project> findProjects();

}
