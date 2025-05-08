package com.ssafy.taskit.domain;

public interface EpicRepository {

  Epic save(Long projectId, NewEpic newEpic, String key);
}
