package com.ssafy.taskit.storage.db.core;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserJpaRepository extends JpaRepository<UserEntity, Long> {
  Long findByEmail(String email);
}
