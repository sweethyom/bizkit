package com.ssafy.taskit.domain.image;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Component;

@Component
public class ImageCompressor {
  public static final double MIN_COMPRESSION_QUALITY = 0.0;
  public static final double MAX_COMPRESSION_QUALITY = 1.0;
  public static final double MIN_SCALE = 0.0;
  public static final double MAX_SCALE = 1.0;

  public File compressFile(File file, ImageCompressionOption option) {
    validateCompressionQuality(option.compressionQuality());
    validateScale(option.scale());

    if (isOriginalSettings(option)) {
      return file;
    }

    byte[] compressedBytes = compressImage(file.content(), option);

    return createCompressedFile(file, compressedBytes);
  }

  private boolean isOriginalSettings(ImageCompressionOption option) {
    return option.equals(ImageCompressionOption.ORIGINAL);
  }

  private byte[] compressImage(byte[] content, ImageCompressionOption option) {
    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    try {
      Thumbnails.of(new ByteArrayInputStream(content))
          .scale(option.scale())
          .outputQuality(option.compressionQuality())
          .toOutputStream(outputStream);
      return outputStream.toByteArray();
    } catch (IOException e) {
      throw new IllegalStateException("이미지 압축에 실패하였습니다.", e);
    }
  }

  private File createCompressedFile(File originalFile, byte[] compressedBytes) {
    return new File(
        originalFile.fileName(),
        originalFile.contentType(),
        compressedBytes,
        compressedBytes.length);
  }

  private void validateCompressionQuality(double compressionQuality) {
    if (compressionQuality <= MIN_COMPRESSION_QUALITY
        || compressionQuality > MAX_COMPRESSION_QUALITY) {
      throw new IllegalArgumentException("압축률은 0 초과 1 이하의 값이어야 합니다.");
    }
  }

  private void validateScale(double scale) {
    if (scale <= MIN_SCALE || scale > MAX_SCALE) {
      throw new IllegalArgumentException("스케일은 0 초과 1 이하의 값이어야 합니다.");
    }
  }
}
