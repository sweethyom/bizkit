package com.ssafy.s12p21d206.achu.file.client;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.ssafy.s12p21d206.achu.domain.image.File;
import com.ssafy.s12p21d206.achu.domain.image.FileClient;
import com.ssafy.s12p21d206.achu.file.config.S3Properties;
import java.io.ByteArrayInputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class S3FileClient implements FileClient {

  private final AmazonS3 s3Client;
  private final S3Properties s3Properties;

  public S3FileClient(AmazonS3 s3Client, S3Properties s3Properties) {
    this.s3Client = s3Client;
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

    s3Client.putObject(request);

    return s3Client.getUrl(bucketName, key).toString();
  }

  @Override
  public List<String> uploadFiles(List<File> files) {
    List<String> urls = new ArrayList<>();
    for (File file : files) {
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
