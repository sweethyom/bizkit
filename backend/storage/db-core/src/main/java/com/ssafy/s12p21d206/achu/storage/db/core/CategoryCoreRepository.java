package com.ssafy.s12p21d206.achu.storage.db.core;

import com.ssafy.s12p21d206.achu.domain.Category;
import com.ssafy.s12p21d206.achu.domain.CategoryRepository;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public class CategoryCoreRepository implements CategoryRepository {

  private final CategoryJpaRepository categoryJpaRepository;

  public CategoryCoreRepository(CategoryJpaRepository categoryJpaRepository) {
    this.categoryJpaRepository = categoryJpaRepository;
  }

  @Override
  public List<Category> findCategories() {
    List<CategoryEntity> categoryEntities = categoryJpaRepository.findAll();
    return categoryEntities.stream().map(CategoryEntity::toCategory).toList();
  }

  @Override
  public boolean existsById(Long categoryId) {
    return categoryJpaRepository.existsByIdAndEntityStatus(categoryId, EntityStatus.ACTIVE);
  }
}
