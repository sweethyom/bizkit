package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.support.DefaultDateTime;

public record Invitation(
    Long id,
    Long userId,
    String email,
    Long projectId,
    String invitationCode,
    DefaultDateTime defaultDateTime) {}
