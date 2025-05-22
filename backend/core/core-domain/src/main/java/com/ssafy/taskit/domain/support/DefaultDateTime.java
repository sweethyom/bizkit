package com.ssafy.taskit.domain.support;

import java.time.LocalDateTime;

public record DefaultDateTime(LocalDateTime createdAt, LocalDateTime updatedAt) {}
