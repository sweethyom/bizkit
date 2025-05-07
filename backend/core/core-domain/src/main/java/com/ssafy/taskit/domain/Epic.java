package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.support.DefaultDateTime;

public record Epic(
    Long id, String name, String key, Long projectId, DefaultDateTime defaultDateTime) {}
