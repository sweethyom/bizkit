package com.ssafy.taskit.auth.api.controller.support;

import com.ssafy.taskit.auth.api.error.AuthCoreApiErrorType;
import com.ssafy.taskit.auth.api.error.AuthCoreApiException;
import com.ssafy.taskit.auth.domain.image.AuthFile;
import java.io.IOException;
import java.io.InputStream;
import org.springframework.web.multipart.MultipartFile;

public class AuthFileConverter {

  private AuthFileConverter() {}

  public static AuthFile convert(MultipartFile multipartFile) {
    try (InputStream inputStream = multipartFile.getInputStream()) {
      byte[] content = inputStream.readAllBytes();
      return new AuthFile(
          multipartFile.getOriginalFilename(),
          multipartFile.getContentType(),
          content,
          multipartFile.getSize());
    } catch (IOException e) {
      throw new AuthCoreApiException(AuthCoreApiErrorType.INVALID_FILE);
    }
  }
}
