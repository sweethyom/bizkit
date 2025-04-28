package com.ssafy.taskit.auth.api.controller.user;

import com.ssafy.taskit.auth.api.controller.AuthApiUser;
import com.ssafy.taskit.auth.api.controller.support.AuthFileConverter;
import com.ssafy.taskit.auth.api.controller.validation.AuthFileSize;
import com.ssafy.taskit.auth.api.controller.validation.Nickname;
import com.ssafy.taskit.auth.api.response.AuthApiResponse;
import com.ssafy.taskit.auth.api.response.AuthDefaultIdResponse;
import com.ssafy.taskit.auth.api.response.AuthIsUniqueResponse;
import com.ssafy.taskit.auth.domain.image.AuthFile;
import com.ssafy.taskit.auth.domain.user.AuthUser;
import com.ssafy.taskit.auth.domain.user.AuthUserImageFacade;
import com.ssafy.taskit.auth.domain.user.AuthUserService;
import jakarta.validation.constraints.Email;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class AuthUserController {

  private final AuthUserService authUserService;
  private final AuthUserImageFacade authUserImageFacade;

  public AuthUserController(
      AuthUserService authUserService, AuthUserImageFacade authUserImageFacade) {
    this.authUserService = authUserService;
    this.authUserImageFacade = authUserImageFacade;
  }

  @PostMapping("/users")
  public AuthApiResponse<AuthDefaultIdResponse> appendUser(
      @RequestBody @Validated AppendAuthUserRequest request) {
    AuthUser authUser =
        authUserService.appendAuthUser(request.toNewAuthUser(), request.verificationCodeId());
    AuthDefaultIdResponse response = new AuthDefaultIdResponse(authUser.id());
    return AuthApiResponse.success(response);
  }

  @PatchMapping("/users/password")
  public AuthApiResponse<Void> modifyPassword(
      AuthApiUser apiUser, @RequestBody @Validated ModifyPasswordRequest request) {
    authUserService.modifyPassword(apiUser.id(), request.oldPassword(), request.newPassword());
    return AuthApiResponse.success();
  }

  @PatchMapping("/users/password/reset")
  public AuthApiResponse<Void> resetPassword(@RequestBody @Validated ResetPasswordRequest request) {
    authUserService.resetPassword(
        request.username(), request.newPassword(), request.verificationCodeId());
    return AuthApiResponse.success();
  }

  @GetMapping("/users/me")
  public AuthApiResponse<AuthUserResponse> findMe(AuthApiUser authApiUser) {
    AuthUser authUser = authUserService.findUser(authApiUser.id());
    AuthUserResponse response = AuthUserResponse.from(authUser);
    return AuthApiResponse.success(response);
  }

  @GetMapping("/users/nickname/is-unique")
  public AuthApiResponse<AuthIsUniqueResponse> checkNicknameIsUnique(
      @RequestParam @Validated @Nickname String nickname) {
    AuthIsUniqueResponse response =
        new AuthIsUniqueResponse(authUserService.isNicknameUnique(nickname));
    return AuthApiResponse.success(response);
  }

  @GetMapping("/users/email/is-unique")
  public AuthApiResponse<AuthIsUniqueResponse> checkEmailIsUnique(
      @RequestParam @Validated @Email String email) {
    AuthIsUniqueResponse response = new AuthIsUniqueResponse(authUserService.isEmailUnique(email));
    return AuthApiResponse.success(response);
  }

  @PatchMapping("/users/nickname")
  public AuthApiResponse<Void> modifyNickname(
      AuthApiUser authApiUser, @RequestBody @Validated ModifyNicknameRequest request) {
    authUserService.modifyNickname(authApiUser.id(), request.nickname());
    return AuthApiResponse.success();
  }

  @PatchMapping("/users/profile-image")
  public AuthApiResponse<Void> modifyProfileImage(
      AuthApiUser authApiUser,
      @RequestParam("profileImage") @AuthFileSize(max = 5L) MultipartFile profileImage) {
    AuthFile profileImageFile = AuthFileConverter.convert(profileImage);
    authUserImageFacade.modifyProfileImage(authApiUser.id(), profileImageFile);
    return AuthApiResponse.success();
  }
}
