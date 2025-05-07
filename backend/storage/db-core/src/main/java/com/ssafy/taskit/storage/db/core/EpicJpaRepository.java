package com.ssafy.taskit.storage.db.core;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EpicJpaRepository extends JpaRepository<EpicEntity, Long> {}
