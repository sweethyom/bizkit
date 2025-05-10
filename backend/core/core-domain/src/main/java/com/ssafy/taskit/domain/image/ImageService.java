package com.ssafy.taskit.domain.image;

import org.springframework.stereotype.Service;

@Service
public class ImageService {
  private final FileUploader fileUploader;
  private final ImageValidator authimageValidator;
  private final ImageCompressor authImageCompressor;

  public ImageService(
      FileUploader fileUploader,
      ImageValidator authimageValidator,
      ImageCompressor authImageCompressor) {
    this.fileUploader = fileUploader;
    this.authimageValidator = authimageValidator;
    this.authImageCompressor = authImageCompressor;
  }

  public String uploadImage(File file, ImageCompressionOption option) {
    authimageValidator.validate(file);
    File compressedFile = authImageCompressor.compressFile(file, option);
    return fileUploader.uploadFile(compressedFile);
  }
}
