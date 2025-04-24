package com.ssafy.taskit.storage.db.core.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EntityScan(basePackages = "com.ssafy.taskit.storage.db.core")
@EnableJpaRepositories(basePackages = "com.ssafy.taskit.storage.db.core")
@Configuration
public class PersistenceJpaConfig {}
