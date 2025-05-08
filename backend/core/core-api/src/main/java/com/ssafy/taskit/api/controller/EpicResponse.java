package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.Epic;
import java.util.List;
import java.util.Map;

public record EpicResponse(
    Long id, String key, String name, Integer cntTotalIssues, Integer cntRemainIssues) {

  public static List<EpicResponse> from(
      List<Epic> epics,
      Map<Long, Integer> totalIssueCountMap,
      Map<Long, Integer> backlogIssueCountMap) {
    return epics.stream()
        .map(epic -> {
          Integer cntTotalIssues = totalIssueCountMap.getOrDefault(epic.id(), 0);
          Integer cntRemainIssues = backlogIssueCountMap.getOrDefault(epic.id(), 0);

          return new EpicResponse(
              epic.id(), epic.key(), epic.name(), cntTotalIssues, cntRemainIssues);
        })
        .toList();
  }
}
