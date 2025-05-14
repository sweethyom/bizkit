package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.image.File;
import com.ssafy.taskit.domain.image.ImageCompressionOption;
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

  public void modifyProjectImage(User user, Long projectId, File imageFile) {
    String imageUrl = imageService.uploadImage(imageFile, ImageCompressionOption.THUMBNAIL_IMAGE);
    projectService.modifyProjectImage(user, projectId, imageUrl);
  }
}
