package com.ssafy.taskit.domain;

public enum IssuePositionOption {
  BEFORE,
  BETWEEN,
  AFTER,
  NOTHING;

  private static final double DEFAULT_GAP = 1000.0;
  private static final double DEFAULT_POSITION = 1000.0;

  public static IssuePositionOption from(Double before, Double after) {
    if (before != null && after != null) return BETWEEN;
    if (before != null) return AFTER;
    if (after != null) return BEFORE;
    return NOTHING;
  }

  public double calculate(Double before, Double after) {
    return switch (this) {
      case BETWEEN -> (before + after) / 2.0;
      case AFTER -> before + DEFAULT_GAP;
      case BEFORE -> after - DEFAULT_GAP;
      case NOTHING -> DEFAULT_POSITION;
    };
  }
}
