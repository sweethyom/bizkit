package com.ssafy.taskit.auth.domain.image;

public enum AuthImageCompressionOption {
  ORIGINAL(1, 1),
  THUMBNAIL_IMAGE(0.8, 0.5),
  PROFILE_IMAGE(0.6, 0.3);

  private final double compressionQuality;
  private final double scale;

  AuthImageCompressionOption(double compressionQuality, double scale) {
    this.compressionQuality = compressionQuality;
    this.scale = scale;
  }

  public double compressionQuality() {
    return compressionQuality;
  }

  public double scale() {
    return scale;
  }
}
