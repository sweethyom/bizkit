package com.ssafy.s12p21d206.achu.file.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class S3Properties {

  @Value("${aws.s3.access-key}")
  private String accessKey;

  @Value("${aws.s3.secret-key}")
  private String secretKey;

  @Value("${aws.s3.region}")
  private String region;

  @Value("${aws.s3.endpoint}")
  private String s3Endpoint;

  @Value("${aws.s3.bucket-name}")
  private String bucketName;

  public String getAccessKey() {
    return accessKey;
  }

  public String getSecretKey() {
    return secretKey;
  }

  public String getRegion() {
    return region;
  }

  public String getS3Endpoint() {
    return s3Endpoint;
  }

  public String getBucketName() {
    return bucketName;
  }
}
