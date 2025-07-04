package com.ssafy.taskit.domain;

import java.util.List;

public interface EpicRepository {

  Epic save(Long projectId, NewEpic newEpic, String key);

  List<Epic> findEpics(Long projectId);

  boolean existsById(Long epicId);

  Epic findById(Long epicId);

  void modifyEpic(Long epicId, ModifyEpic modifyEpic);

  void deleteEpic(Long epicId);

  List<Epic> findAllByIds(List<Long> epicIds);
}
