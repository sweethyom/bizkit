package com.ssafy.s12p21d206.achu.storage.db.core;

import com.ssafy.s12p21d206.achu.domain.ImageUrlsWithThumbnail;
import com.ssafy.s12p21d206.achu.domain.Memory;
import com.ssafy.s12p21d206.achu.domain.support.DefaultDateTime;
import com.ssafy.s12p21d206.achu.storage.db.core.converter.ImgUrlListJsonConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.util.List;

@Table(name = "memory")
@Entity
public class MemoryEntity extends BaseEntity {
  private String title;

  private String content;

  private String thumbnailImageUrl;

  @Convert(converter = ImgUrlListJsonConverter.class)
  @Column(name = "imgUrls", columnDefinition = "json")
  private List<String> imgUrls;

  private Long babyId;

  protected MemoryEntity() {}

  public MemoryEntity(
      String title, String content, String thumbnailImageUrl, List<String> imgUrls, Long babyId) {
    this.title = title;
    this.content = content;
    this.thumbnailImageUrl = thumbnailImageUrl;
    this.imgUrls = imgUrls;
    this.babyId = babyId;
  }

  public Memory toMemory() {
    return new Memory(
        getId(),
        this.title,
        this.content,
        new ImageUrlsWithThumbnail(this.thumbnailImageUrl, this.imgUrls),
        this.babyId,
        new DefaultDateTime(getCreatedAt(), getUpdatedAt()));
  }

  public void updateText(String title, String content) {
    this.title = title;
    this.content = content;
  }

  public void updateImages(ImageUrlsWithThumbnail imageUrlsWithThumbnail) {
    this.thumbnailImageUrl = imageUrlsWithThumbnail.thumbnailImageUrl();
    this.imgUrls = imageUrlsWithThumbnail.imageUrls();
  }
}
