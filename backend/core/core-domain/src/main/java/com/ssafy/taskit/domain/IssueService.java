package com.ssafy.taskit.domain;

import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class IssueService {

  public IssueService() {}

  public Map<Long, Integer> countTotalIssues(List<Long> epicIds) {
    return Map.of();
  }

  public Map<Long, Integer> countBacklogIssues(List<Long> epicIds) {
    return Map.of();
  }
}
