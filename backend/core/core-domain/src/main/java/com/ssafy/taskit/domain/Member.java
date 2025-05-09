package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.support.DefaultDateTime;
import java.time.LocalDateTime;

public record Member(
    Long id,
    Long userId,
    Long projectId,
    Role memberRole,
    LocalDateTime viewedAt,
    DefaultDateTime defaultDateTime) {}
