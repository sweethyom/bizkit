package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.image.File;
import com.ssafy.taskit.domain.image.ImageService;
import org.springframework.stereotype.Service;

@Service
public class ProjectImageFacade {
  private final ProjectService projectService;
  private final ImageService imageService;

  public ProjectImageFacade(ProjectService projectService, ImageService imageService) {
    this.projectService = projectService;
    this.imageService = imageService;
  }

  public Long append(User user, File imageFile, NewProject newProject) {
    String imageUrl = imageService.uploadImage(imageFile);
    return projectService.append(user, newProject, imageUrl);
  }

  public Long append(User user, NewProject newProject) {
    return projectService.append(user, newProject, null);
  }
}
