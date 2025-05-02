package com.ssafy.taskit.api.controller;

public record InvitationMemberResponse(
    String invitationId, Long id, String nickname, String email, String profileImage) {}
