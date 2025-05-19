package com.ssafy.taskit.domain;

public class IssuePositionCalculator {

  private static final double DEFAULT_GAP = 1000.0;
  private static final double DEFAULT_POSITION = 1000.0;

  public static double calculate(Double before, Double after) {
    if (before != null && after != null) {
      return (before + after) / 2.0;
    } else if (before != null) {
      return before + DEFAULT_GAP;
    } else if (after != null) {
      return after - DEFAULT_GAP;
    } else {
      return DEFAULT_POSITION;
    }
  }
}
