package com.ssafy.taskit.domain;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class EpicService {

  private final EpicAppender epicAppender;
  private final EpicReader epicReader;

  public EpicService(EpicAppender epicAppender, EpicReader epicReader) {
    this.epicAppender = epicAppender;
    this.epicReader = epicReader;
  }

  public Epic append(User user, Long projectId, NewEpic newEpic) {
    return epicAppender.append(user, projectId, newEpic);
  }

  public List<Epic> findEpics(User user, Long projectId) {
    return epicReader.readEpics(user, projectId);
  }
}
