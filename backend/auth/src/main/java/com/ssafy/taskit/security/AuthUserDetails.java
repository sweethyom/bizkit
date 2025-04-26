package com.ssafy.taskit.security;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class AuthUserDetails implements UserDetails {

  private Long id;
  private String username;
  private String password;
  private List<String> roles = new ArrayList<>();

  public AuthUserDetails(Long id, String username, String password, List<String> roles) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.roles = roles;
  }

  public AuthUserDetails(String username, String password) {
    this.username = username;
    this.password = password;
  }

  public AuthUserDetails(Long id, String username, List<String> roles) {
    this.id = id;
    this.username = username;
    this.roles = roles;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return roles.stream().map(SimpleGrantedAuthority::new).toList();
  }

  @Override
  public String getPassword() {
    return password;
  }

  @Override
  public String getUsername() {
    return username;
  }

  public List<String> getRoles() {
    return getAuthorities().stream().map(GrantedAuthority::toString).toList();
  }

  public Long getId() {
    return id;
  }
}
