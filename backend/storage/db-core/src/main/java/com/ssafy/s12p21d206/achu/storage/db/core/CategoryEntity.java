package com.ssafy.s12p21d206.achu.storage.db.core;

import com.ssafy.s12p21d206.achu.domain.Category;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Table(name = "category")
@Entity
public class CategoryEntity extends BaseEntity {

  private String name;

  private String imgUrl;

  protected CategoryEntity() {}

  public Category toCategory() {
    return new Category(getId(), name, imgUrl);
  }
}
