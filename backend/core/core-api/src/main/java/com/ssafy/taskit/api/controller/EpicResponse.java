package com.ssafy.taskit.api.controller;

public record EpicResponse(Long id, String key, String name, Long totalIssues, Long remainIssues) {}
