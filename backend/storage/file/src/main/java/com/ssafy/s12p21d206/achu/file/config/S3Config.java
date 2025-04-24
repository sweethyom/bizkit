package com.ssafy.s12p21d206.achu.file.config;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class S3Config {

  private final S3Properties s3Properties;

  public S3Config(S3Properties s3Properties) {
    this.s3Properties = s3Properties;
  }

  @Bean
  public AmazonS3 s3Client() {
    AWSCredentials awsCredentials =
        new BasicAWSCredentials(s3Properties.getAccessKey(), s3Properties.getSecretKey());

    return AmazonS3ClientBuilder.standard()
        .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
        .withEndpointConfiguration(new AmazonS3ClientBuilder.EndpointConfiguration(
            s3Properties.getS3Endpoint(), s3Properties.getRegion()))
        .enablePathStyleAccess()
        .build();
  }
}
