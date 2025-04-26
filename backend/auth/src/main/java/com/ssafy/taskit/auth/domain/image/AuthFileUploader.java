package com.ssafy.taskit.auth.domain.image;

import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class AuthFileUploader {

  private final AuthFileClient fileClient;

  public AuthFileUploader(AuthFileClient fileClient) {
    this.fileClient = fileClient;
  }

  String uploadFile(AuthFile file) {
    return fileClient.uploadFile(file);
  }

  List<String> uploadFiles(List<AuthFile> files) {
    return fileClient.uploadFiles(files);
  }
}
