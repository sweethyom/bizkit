package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.Epic;
import java.util.List;
import java.util.Map;

public record EpicResponse(
    Long id, String key, String name, Long cntTotalIssues, Long cntRemainIssues) {

  public static List<EpicResponse> from(
      List<Epic> epics, Map<Long, Long> totalIssueCountMap, Map<Long, Long> backlogIssueCountMap) {
    return epics.stream()
        .map(epic -> {
          Long cntTotalIssues = totalIssueCountMap.getOrDefault(epic.id(), 0L);
          Long cntRemainIssues = backlogIssueCountMap.getOrDefault(epic.id(), 0L);

          return new EpicResponse(
              epic.id(), epic.key(), epic.name(), cntTotalIssues, cntRemainIssues);
        })
        .toList();
  }
}
