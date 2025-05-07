package com.ssafy.taskit.domain.image;

import org.springframework.stereotype.Component;

@Component
public class FileUploader {

  private final FileClient fileClient;

  public FileUploader(FileClient fileClient) {
    this.fileClient = fileClient;
  }

  String uploadFile(File file) {
    return fileClient.uploadFile(file);
  }
}
