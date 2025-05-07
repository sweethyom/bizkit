package com.ssafy.taskit.domain.image;

public enum ImageCompressionOption {
  ORIGINAL(1, 1),
  THUMBNAIL_IMAGE(0.6, 0.3);

  private final double compressQuality;
  private final double scale;

  ImageCompressionOption(double compressionQuality, double scale) {
    this.compressQuality = compressionQuality;
    this.scale = scale;
  }

  public double compressionQuality() {
    return compressQuality;
  }

  public double scale() {
    return scale;
  }
}
