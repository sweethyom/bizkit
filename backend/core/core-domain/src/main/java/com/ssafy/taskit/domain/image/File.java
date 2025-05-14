package com.ssafy.taskit.domain.image;

import java.util.Arrays;
import java.util.Objects;

public record File(String fileName, String contentType, byte[] content, long size) {

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    File file = (File) o;
    return size == file.size
        && Objects.deepEquals(content, file.content)
        && Objects.equals(fileName, file.fileName)
        && Objects.equals(contentType, file.contentType);
  }

  @Override
  public int hashCode() {
    return Objects.hash(fileName, contentType, Arrays.hashCode(content), size);
  }

  @Override
  public String toString() {
    return "File{" + "fileName='"
        + fileName + '\'' + ", contentType='"
        + contentType + '\'' + ", content='"
        + Arrays.toString(content) + '\'' + ", size='"
        + size + '}';
  }
}
