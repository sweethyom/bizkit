package com.ssafy.s12p21d206.achu.storage.db.core;

import com.ssafy.s12p21d206.achu.domain.ImageUrlsWithThumbnail;
import com.ssafy.s12p21d206.achu.domain.Memory;
import com.ssafy.s12p21d206.achu.domain.MemoryRepository;
import com.ssafy.s12p21d206.achu.domain.ModifyMemory;
import com.ssafy.s12p21d206.achu.domain.NewMemory;
import com.ssafy.s12p21d206.achu.domain.error.CoreErrorType;
import com.ssafy.s12p21d206.achu.domain.error.CoreException;
import com.ssafy.s12p21d206.achu.domain.support.SortType;
import com.ssafy.s12p21d206.achu.storage.db.core.support.SortUtils;
import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public class MemoryCoreRepository implements MemoryRepository {
  private final MemoryJpaRepository memoryJpaRepository;

  public MemoryCoreRepository(MemoryJpaRepository memoryJpaRepository) {
    this.memoryJpaRepository = memoryJpaRepository;
  }

  @Override
  public Memory save(
      Long babyId, NewMemory newMemory, ImageUrlsWithThumbnail imageUrlsWithThumbnail) {
    return memoryJpaRepository
        .save(new MemoryEntity(
            newMemory.title(),
            newMemory.content(),
            imageUrlsWithThumbnail.thumbnailImageUrl(),
            imageUrlsWithThumbnail.imageUrls(),
            babyId))
        .toMemory();
  }

  @Override
  public Memory findMemory(Long memoryId) {
    return memoryJpaRepository
        .findByIdAndEntityStatus(memoryId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.DATA_NOT_FOUND))
        .toMemory();
  }

  @Override
  public List<Memory> findMemories(Long babyId, Long offset, Long limit, SortType sort) {
    Pageable pageable =
        PageRequest.of(offset.intValue(), limit.intValue(), SortUtils.convertSort(sort));
    List<MemoryEntity> memoryEntities =
        memoryJpaRepository.findByBabyIdAndEntityStatus(babyId, pageable, EntityStatus.ACTIVE);
    return memoryEntities.stream().map(MemoryEntity::toMemory).toList();
  }

  @Override
  public Memory modifyMemory(Long memoryId, ModifyMemory modifyMemory) {
    MemoryEntity memory = memoryJpaRepository
        .findByIdAndEntityStatus(memoryId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.DATA_NOT_FOUND));
    memory.updateText(modifyMemory.title(), modifyMemory.content());

    memoryJpaRepository.save(memory);
    return memory.toMemory();
  }

  @Override
  public Long delete(Long memoryId) {
    MemoryEntity memory = memoryJpaRepository
        .findByIdAndEntityStatus(memoryId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.DATA_NOT_FOUND));
    memory.delete();
    memoryJpaRepository.save(memory);
    return memory.getId();
  }

  @Override
  public boolean existsById(Long memoryId) {
    return memoryJpaRepository.existsByIdAndEntityStatus(memoryId, EntityStatus.ACTIVE);
  }

  @Override
  public Memory modifyImages(Long memoryId, ImageUrlsWithThumbnail imageUrlsWithThumbnail) {
    MemoryEntity memory = memoryJpaRepository
        .findByIdAndEntityStatus(memoryId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.DATA_NOT_FOUND));
    memory.updateImages(imageUrlsWithThumbnail);

    memoryJpaRepository.save(memory);
    return memory.toMemory();
  }
}
