package com.ssafy.taskit.security;

import com.ssafy.taskit.auth.domain.user.AuthUser;
import com.ssafy.taskit.auth.domain.user.AuthUserRepository;
import java.util.List;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthUserDetailService implements UserDetailsService {

  private final AuthUserRepository userRepository;

  public AuthUserDetailService(AuthUserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    AuthUser user = userRepository
        .findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException(username));

    return new AuthUserDetails(user.id(), user.email(), user.password(), List.of("USER"));
  }
}
