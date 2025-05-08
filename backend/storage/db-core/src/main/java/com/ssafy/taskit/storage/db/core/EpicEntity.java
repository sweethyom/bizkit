package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.Epic;
import com.ssafy.taskit.domain.support.DefaultDateTime;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Table(name = "epic")
@Entity
public class EpicEntity extends BaseEntity {

  private String name;
  private String key;
  private Long projectId;

  protected EpicEntity() {}

  public EpicEntity(String name, String key, Long projectId) {
    this.name = name;
    this.key = key;
    this.projectId = projectId;
  }

  public Epic toEpic() {
    return new Epic(
        getId(),
        this.name,
        this.key,
        this.projectId,
        new DefaultDateTime(getCreatedAt(), getUpdatedAt()));
  }

  public void updateEpicName(String name) {
    this.name = name;
  }
}
