package com.ssafy.taskit.storage.db.core;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Table(name = "refresh_token")
@Entity
public class RefreshTokenEntity {

  @Id
  private String username;

  @Column(length = 2000)
  private String refreshToken;

  private LocalDateTime expirationTime;

  protected RefreshTokenEntity() {}

  public RefreshTokenEntity(String username, String refreshToken, LocalDateTime expirationTime) {
    this.username = username;
    this.refreshToken = refreshToken;
    this.expirationTime = expirationTime;
  }

  public String getUsername() {
    return username;
  }

  public LocalDateTime getExpirationTime() {
    return expirationTime;
  }

  public String getRefreshToken() {
    return refreshToken;
  }
}
