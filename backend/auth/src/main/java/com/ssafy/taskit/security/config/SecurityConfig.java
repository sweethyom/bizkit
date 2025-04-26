package com.ssafy.taskit.security.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.taskit.security.AccessTokenReissueFilter;
import com.ssafy.taskit.security.ErrorResponseAuthenticationFailureHandler;
import com.ssafy.taskit.security.JsonLoginProcessingFilter;
import com.ssafy.taskit.security.JwtAuthenticationEntryPoint;
import com.ssafy.taskit.security.JwtAuthenticationProcessingFilter;
import com.ssafy.taskit.security.JwtAuthenticationSuccessHandler;
import com.ssafy.taskit.security.JwtService;
import com.ssafy.taskit.security.RefreshTokenRenewFilter;
import java.util.Arrays;
import java.util.Collections;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@EnableWebSecurity
@Configuration
public class SecurityConfig {

  private final ObjectMapper objectMapper;

  private final JwtService jwtService;

  private final AuthenticationConfiguration authenticationConfiguration;

  public SecurityConfig(
      ObjectMapper objectMapper,
      JwtService jwtService,
      AuthenticationConfiguration authenticationConfiguration) {
    this.objectMapper = objectMapper;
    this.jwtService = jwtService;
    this.authenticationConfiguration = authenticationConfiguration;
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOriginPatterns(Collections.singletonList("*"));
    configuration.setAllowedMethods(
        Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Collections.singletonList("*"));
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.cors(cors -> cors.configurationSource(corsConfigurationSource()));
    http.httpBasic(AbstractHttpConfigurer::disable);
    http.formLogin(AbstractHttpConfigurer::disable);
    http.csrf(AbstractHttpConfigurer::disable);
    http.sessionManagement(
        session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
    http.anonymous(AbstractHttpConfigurer::disable);

    http.authorizeHttpRequests(auth -> auth.requestMatchers(HttpMethod.POST, "/users")
        .permitAll()
        .requestMatchers(HttpMethod.GET, "/users/email/is-unique")
        .permitAll()
        .requestMatchers(HttpMethod.GET, "/users/nickname/is-unique")
        .permitAll()
        .requestMatchers(HttpMethod.POST, "/verification/request")
        .permitAll()
        .requestMatchers(HttpMethod.POST, "/verification/verify")
        .permitAll()
        .requestMatchers(HttpMethod.PATCH, "/users/password/reset")
        .permitAll()
        .requestMatchers("/chat-ws/**")
        .permitAll()
        .anyRequest()
        .authenticated());

    http.exceptionHandling(exceptionHandling ->
        exceptionHandling.authenticationEntryPoint(authenticationEntryPoint()));

    http.addFilterAt(jsonLoginProcessingFilter(), UsernamePasswordAuthenticationFilter.class);
    http.addFilterBefore(
        jwtAuthenticationProcessingFilter(), UsernamePasswordAuthenticationFilter.class);
    http.addFilterBefore(accessTokenReissueFilter(), UsernamePasswordAuthenticationFilter.class);
    http.addFilterBefore(refreshTokenRenewFilter(), UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  @Bean
  public AccessTokenReissueFilter accessTokenReissueFilter() {
    return new AccessTokenReissueFilter(jwtService, objectMapper);
  }

  @Bean
  public RefreshTokenRenewFilter refreshTokenRenewFilter() {
    return new RefreshTokenRenewFilter(jwtService, objectMapper);
  }

  @Bean
  public AbstractAuthenticationProcessingFilter jsonLoginProcessingFilter() throws Exception {
    JsonLoginProcessingFilter jsonLoginProcessingFilter =
        new JsonLoginProcessingFilter(objectMapper);

    jsonLoginProcessingFilter.setAuthenticationManager(authenticationManager());
    jsonLoginProcessingFilter.setAuthenticationSuccessHandler(authenticationSuccessHandler());
    jsonLoginProcessingFilter.setAuthenticationFailureHandler(authenticationFailureHandler());

    return jsonLoginProcessingFilter;
  }

  @Bean
  public AuthenticationSuccessHandler authenticationSuccessHandler() {
    return new JwtAuthenticationSuccessHandler(jwtService, objectMapper);
  }

  @Bean
  public AuthenticationFailureHandler authenticationFailureHandler() {
    return new ErrorResponseAuthenticationFailureHandler(objectMapper);
  }

  @Bean
  public AuthenticationManager authenticationManager() throws Exception {
    return authenticationConfiguration.getAuthenticationManager();
  }

  @Bean
  AuthenticationEntryPoint authenticationEntryPoint() {
    return new JwtAuthenticationEntryPoint(objectMapper);
  }

  @Bean
  JwtAuthenticationProcessingFilter jwtAuthenticationProcessingFilter() {
    return new JwtAuthenticationProcessingFilter(jwtService);
  }
}
