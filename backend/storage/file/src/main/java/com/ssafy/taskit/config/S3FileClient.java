package com.ssafy.taskit.config;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.ssafy.taskit.domain.image.File;
import com.ssafy.taskit.domain.image.FileClient;
import java.io.ByteArrayInputStream;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class S3FileClient implements FileClient {

  private final AmazonS3 amazonS3;
  private final S3Properties s3Properties;

  public S3FileClient(AmazonS3 amazonS3, S3Properties s3Properties) {
    this.amazonS3 = amazonS3;
    this.s3Properties = s3Properties;
  }

  @Override
  public String uploadFile(File file) {
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

    amazonS3.putObject(request);

    return amazonS3.getUrl(bucketName, key).toString();
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
