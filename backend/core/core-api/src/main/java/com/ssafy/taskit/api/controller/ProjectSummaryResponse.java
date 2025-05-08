package com.ssafy.taskit.api.controller;

public record ProjectSummaryResponse(
    Long id, String name, String image, UserProfileResponse leader) {}
