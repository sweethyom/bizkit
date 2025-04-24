package com.ssafy.s12p21d206.achu.storage.db.core.support;

import com.ssafy.s12p21d206.achu.domain.support.SortType;
import org.springframework.data.domain.Sort;

public class SortUtils {

  private SortUtils() {
    throw new UnsupportedOperationException("Utility class");
  }

  public static Sort convertSort(SortType sort) {
    return switch (sort) {
      case LATEST -> Sort.by(Sort.Direction.DESC, "createdAt");
      case OLDEST -> Sort.by(Sort.Direction.ASC, "createdAt");
    };
  }
}
