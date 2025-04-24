package com.ssafy.s12p21d206.achu.file.config;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CreateBucketRequest;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class S3Initializer implements CommandLineRunner {

  private final AmazonS3 amazonS3;
  private final S3Properties s3Properties;

  public S3Initializer(AmazonS3 amazonS3, S3Properties s3Properties) {
    this.amazonS3 = amazonS3;
    this.s3Properties = s3Properties;
  }

  @Override
  public void run(String... args) {
    String bucketName = s3Properties.getBucketName();
    String region = s3Properties.getRegion();

    if (!amazonS3.doesBucketExistV2(bucketName)) {
      amazonS3.createBucket(new CreateBucketRequest(bucketName, region));
    }
  }
}
