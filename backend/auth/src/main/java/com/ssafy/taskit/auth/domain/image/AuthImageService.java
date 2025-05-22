package com.ssafy.taskit.auth.domain.image;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class AuthImageService {

  private final AuthFileUploader fileUploader;
  private final AuthImageValidator authImageValidator;
  private final AuthImageCompressor authImageCompressor;

  public AuthImageService(
      AuthFileUploader fileUploader,
      AuthImageValidator authImageValidator,
      AuthImageCompressor authImageCompressor) {
    this.fileUploader = fileUploader;
    this.authImageValidator = authImageValidator;
    this.authImageCompressor = authImageCompressor;
  }

  public String uploadImage(AuthFile file, AuthImageCompressionOption option) {
    authImageValidator.validate(file);
    AuthFile compressedFile = authImageCompressor.compressFile(file, option);
    return fileUploader.uploadFile(compressedFile);
  }

  public String uploadImage(AuthFile file) {
    return uploadImage(file, AuthImageCompressionOption.ORIGINAL);
  }

  public List<String> uploadImages(List<AuthFile> files, AuthImageCompressionOption option) {
    List<AuthFile> compressedFiles = files.stream()
        .map(file -> authImageCompressor.compressFile(file, option))
        .toList();
    return fileUploader.uploadFiles(compressedFiles);
  }

  public List<String> uploadImages(List<AuthFile> files) {
    return uploadImages(files, AuthImageCompressionOption.ORIGINAL);
  }
}
