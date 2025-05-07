package com.ssafy.taskit.domain.image;

import org.springframework.stereotype.Service;

@Service
public class ImageService {

  private final FileUploader fileUploader;

  private final ImageValidator authImageValidator;

  private final ImageCompressor authImageCompressor;

  public ImageService(
      FileUploader fileUploader,
      ImageValidator authImageValidator,
      ImageCompressor authImageCompressor) {
    this.fileUploader = fileUploader;
    this.authImageValidator = authImageValidator;
    this.authImageCompressor = authImageCompressor;
  }

  public String uploadImage(File file, ImageCompressionOption option) {
    authImageValidator.validate(file);
    File compressedFile = authImageCompressor.compressFile(file, option);
    return fileUploader.uploadFile(compressedFile);
  }

  public String uploadImage(File file) {
    return uploadImage(file, ImageCompressionOption.ORIGINAL);
  }

  public ImageUrlsWithProjectProfile uploadImageUrlsWithThumbnail(File imageFile) {
    String thumbnailImageUrl = uploadImage(imageFile, ImageCompressionOption.THUMBNAIL_IMAGE);
    String imageUrl = uploadImage(imageFile);
    return new ImageUrlsWithProjectProfile(thumbnailImageUrl, imageUrl);
  }
}
