package com.ssafy.taskit.api.controller.support;

import com.ssafy.taskit.api.error.CoreApiErrorType;
import com.ssafy.taskit.api.error.CoreApiException;
import com.ssafy.taskit.domain.image.File;
import java.io.IOException;
import java.io.InputStream;
import org.springframework.web.multipart.MultipartFile;

public class FileConverter {
  private FileConverter() {}

  public static File convert(MultipartFile multipartFile) {
    try (InputStream inputStream = multipartFile.getInputStream()) {
      byte[] content = inputStream.readAllBytes();
      return new File(
          multipartFile.getOriginalFilename(),
          multipartFile.getContentType(),
          content,
          multipartFile.getSize());
    } catch (IOException e) {
      throw new CoreApiException(CoreApiErrorType.INVALID_FILE);
    }
  }
}
