package com.ssafy.taskit.domain;

import java.util.List;

public interface EpicRepository {

  Epic save(Long projectId, NewEpic newEpic, String key);

  List<Epic> findEpics(Long projectId);
}
