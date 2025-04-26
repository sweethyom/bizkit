package com.ssafy.taskit.storage.db.core;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthUserJpaRepository extends JpaRepository<AuthUserEntity, Long> {

  boolean existsByNicknameAndEntityStatus(String nickname, AuthEntityStatus status);

  boolean existsByEmailAndEntityStatus(String email, AuthEntityStatus status);

  Optional<AuthUserEntity> findByEmailAndEntityStatus(String email, AuthEntityStatus status);

  Optional<AuthUserEntity> findByIdAndEntityStatus(Long id, AuthEntityStatus status);
}
