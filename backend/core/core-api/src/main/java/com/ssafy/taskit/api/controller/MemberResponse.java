package com.ssafy.taskit.api.controller;

public record MemberResponse(Long id, String nickname, String email, String profileImage, Boolean leader) {
}
