package com.ssafy.taskit.domain;

public enum IssueMoveOption {
  STATUS_ONLY,
  COMPONENT_ONLY,
  STATUS_AND_COMPONENT,
  NO_CHANGE;

  public static IssueMoveOption from(boolean componentChanged, boolean statusChanged) {
    if (componentChanged && statusChanged) return STATUS_AND_COMPONENT;
    if (componentChanged) return COMPONENT_ONLY;
    if (statusChanged) return STATUS_ONLY;
    return NO_CHANGE;
  }
}
