package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.Epic;

public record IssueDetailEpicResponse(Long id, String name, String key) {
  public static IssueDetailEpicResponse from(Epic epic) {
    return new IssueDetailEpicResponse(epic.id(), epic.name(), epic.key());
  }
}
