package com.ssafy.taskit.auth.api.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ssafy.taskit.auth.api.error.AuthErrorMessage;

public class AuthApiResponse<S> {

  private final AuthResultType result;

  @JsonInclude(JsonInclude.Include.NON_NULL)
  private final S data;

  @JsonInclude(JsonInclude.Include.NON_NULL)
  private final AuthErrorMessage error;

  private AuthApiResponse(AuthResultType result, S data, AuthErrorMessage error) {
    this.result = result;
    this.data = data;
    this.error = error;
  }

  public static AuthApiResponse<Void> success() {
    return new AuthApiResponse<>(AuthResultType.SUCCESS, null, null);
  }

  public static <S> AuthApiResponse<S> success(S data) {
    return new AuthApiResponse<>(AuthResultType.SUCCESS, data, null);
  }

  public static AuthApiResponse<Void> error(AuthErrorMessage errorMessage) {
    return new AuthApiResponse<>(AuthResultType.ERROR, null, errorMessage);
  }

  public AuthResultType getResult() {
    return result;
  }

  public Object getData() {
    return data;
  }

  public AuthErrorMessage getError() {
    return error;
  }
}
