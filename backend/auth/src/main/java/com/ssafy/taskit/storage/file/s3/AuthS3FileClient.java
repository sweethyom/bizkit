package com.ssafy.taskit.storage.file.s3;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.ssafy.taskit.auth.domain.image.AuthFile;
import com.ssafy.taskit.auth.domain.image.AuthFileClient;
import java.io.ByteArrayInputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class AuthS3FileClient implements AuthFileClient {

  private final AmazonS3 s3Client;
  private final AuthS3Properties s3Properties;

  public AuthS3FileClient(AmazonS3 s3Client, AuthS3Properties s3Properties) {
    this.s3Client = s3Client;
    this.s3Properties = s3Properties;
  }

  @Override
  public String uploadFile(AuthFile file) {
    String originalFileName = file.fileName();
    String extension = getFileExtension(originalFileName);
    String key = UUID.randomUUID() + extension;
    String bucketName = s3Properties.getBucketName();

    ObjectMetadata metadata = new ObjectMetadata();
    metadata.setContentLength(file.size());
    if (file.contentType() != null) {
      metadata.setContentType(file.contentType());
    }

    PutObjectRequest request = new PutObjectRequest(
            bucketName, key, new ByteArrayInputStream(file.content()), metadata)
        .withCannedAcl(CannedAccessControlList.PublicRead);

    s3Client.putObject(request);

    return s3Client.getUrl(bucketName, key).toString();
  }

  @Override
  public List<String> uploadFiles(List<AuthFile> files) {
    List<String> urls = new ArrayList<>();
    for (AuthFile file : files) {
      String url = uploadFile(file);
      urls.add(url);
    }
    return urls;
  }

  /**
   * 파일 이름에서 확장자 추출
   */
  private String getFileExtension(String fileName) {
    if (fileName == null || fileName.isEmpty()) {
      return "";
    }
    int dotIndex = fileName.lastIndexOf('.');
    if (dotIndex > 0 && dotIndex < fileName.length() - 1) {
      return fileName.substring(dotIndex);
    }
    return "";
  }
}
