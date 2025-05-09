package com.ssafy.taskit.domain;

import java.util.List;

public interface MemberRepository {

  List<Long> findProjectIdsByUserIdOrderByViewedAtDesc(Long userId);
}
