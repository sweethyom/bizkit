package com.ssafy.taskit.storage.db.core;

import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@EntityListeners(AuditingEntityListener.class)
@MappedSuperclass
public abstract class AuthBaseEntity extends AuthMetaEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  protected AuthBaseEntity() {}

  protected AuthBaseEntity(Long id) {
    this.id = id;
  }

  public Long getId() {
    return id;
  }
}
