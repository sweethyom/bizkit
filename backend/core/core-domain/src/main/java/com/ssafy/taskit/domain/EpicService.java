package com.ssafy.taskit.domain;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class EpicService {

  private final EpicAppender epicAppender;
  private final EpicReader epicReader;
  private final EpicModifier epicModifier;

  public EpicService(EpicAppender epicAppender, EpicReader epicReader, EpicModifier epicModifier) {
    this.epicAppender = epicAppender;
    this.epicReader = epicReader;
    this.epicModifier = epicModifier;
  }

  public Epic append(User user, Long projectId, NewEpic newEpic) {
    return epicAppender.append(user, projectId, newEpic);
  }

  public List<Epic> findEpics(User user, Long projectId) {
    return epicReader.readEpics(user, projectId);
  }

  public void modifyEpic(User user, Long epicId, ModifyEpic modifyEpic) {
    epicModifier.modifyEpic(user, epicId, modifyEpic);
  }
}
