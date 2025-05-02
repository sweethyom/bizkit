package com.ssafy.taskit.api.controller;

public record InvitedMemberResponse(
    String invitationId, Long id, String nickname, String email, String profileImage) {}
