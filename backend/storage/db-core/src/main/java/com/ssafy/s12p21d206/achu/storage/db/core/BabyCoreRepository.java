package com.ssafy.s12p21d206.achu.storage.db.core;

import com.ssafy.s12p21d206.achu.domain.Baby;
import com.ssafy.s12p21d206.achu.domain.BabyRepository;
import com.ssafy.s12p21d206.achu.domain.NewBaby;
import com.ssafy.s12p21d206.achu.domain.Sex;
import com.ssafy.s12p21d206.achu.domain.User;
import com.ssafy.s12p21d206.achu.domain.error.CoreErrorType;
import com.ssafy.s12p21d206.achu.domain.error.CoreException;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class BabyCoreRepository implements BabyRepository {

  private final BabyJpaRepository babyJpaRepository;

  public BabyCoreRepository(BabyJpaRepository babyJpaRepository) {
    this.babyJpaRepository = babyJpaRepository;
  }

  @Override
  public Baby save(User user, NewBaby newBaby, String imageUrl) {
    return babyJpaRepository
        .save(new BabyEntity(
            user.id(), newBaby.nickname(), newBaby.gender(), imageUrl, newBaby.birth()))
        .toBaby();
  }

  @Override
  public List<Baby> findByUser(User user) {
    return babyJpaRepository.findByUserIdAndEntityStatus(user.id(), EntityStatus.ACTIVE).stream()
        .map(BabyEntity::toBaby)
        .toList();
  }

  @Override
  public Optional<Baby> findById(Long id) {
    return babyJpaRepository
        .findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
        .map(BabyEntity::toBaby);
  }

  @Transactional
  @Override
  public Long delete(Long id) {
    Optional<BabyEntity> optionalEntity =
        babyJpaRepository.findByIdAndEntityStatus(id, EntityStatus.ACTIVE);

    if (optionalEntity.isEmpty()) {
      return -1L;
    }

    BabyEntity babyEntity = optionalEntity.get();
    babyEntity.delete();
    return babyEntity.getId();
  }

  @Override
  public boolean existsByIdAndEntityStatus(Long id) {
    return babyJpaRepository.existsByIdAndEntityStatus(id, EntityStatus.ACTIVE);
  }

  @Override
  public boolean existsByIdAndUser(Long id, User user) {
    return babyJpaRepository.existsByIdAndUserIdAndEntityStatus(id, user.id(), EntityStatus.ACTIVE);
  }

  @Override
  public Baby modifyNickname(Long id, String nickname) {
    BabyEntity babyEntity = babyJpaRepository
        .findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.DATA_NOT_FOUND));

    babyEntity.changeNickname(nickname);

    babyJpaRepository.save(babyEntity);

    return babyEntity.toBaby();
  }

  @Override
  public Baby modifyBirth(Long id, LocalDate birth) {
    BabyEntity babyEntity = babyJpaRepository
        .findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.DATA_NOT_FOUND));

    babyEntity.changeBirth(birth);
    babyJpaRepository.save(babyEntity);
    return babyEntity.toBaby();
  }

  @Override
  public Baby modifyGender(Long id, Sex gender) {
    BabyEntity babyEntity = babyJpaRepository
        .findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.DATA_NOT_FOUND));

    babyEntity.changeGender(gender);
    babyJpaRepository.save(babyEntity);
    return babyEntity.toBaby();
  }

  @Override
  public int countByUserId(Long id) {
    return babyJpaRepository.countByUserIdAndEntityStatus(id, EntityStatus.ACTIVE);
  }

  @Override
  public Baby modifyImageUrl(Long id, String profileImageUrl) {
    BabyEntity babyEntity = babyJpaRepository
        .findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.DATA_NOT_FOUND));

    babyEntity.changeImageUrl(profileImageUrl);
    babyJpaRepository.save(babyEntity);
    return babyEntity.toBaby();
  }
}
