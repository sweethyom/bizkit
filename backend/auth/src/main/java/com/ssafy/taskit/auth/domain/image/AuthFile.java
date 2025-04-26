package com.ssafy.taskit.auth.domain.image;

import java.util.Arrays;
import java.util.Objects;

public record AuthFile(String fileName, String contentType, byte[] content, long size) {

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    AuthFile authFile = (AuthFile) o;
    return size == authFile.size
        && Objects.deepEquals(content, authFile.content)
        && Objects.equals(fileName, authFile.fileName)
        && Objects.equals(contentType, authFile.contentType);
  }

  @Override
  public int hashCode() {
    return Objects.hash(fileName, contentType, Arrays.hashCode(content), size);
  }

  @Override
  public String toString() {
    return "AuthFile{" + "fileName='"
        + fileName + '\'' + ", contentType='"
        + contentType + '\'' + ", content="
        + Arrays.toString(content) + ", size="
        + size + '}';
  }
}
