package com.ssafy.taskit.domain;

import org.springframework.stereotype.Service;

@Service
public class EpicService {

  private final EpicAppender epicAppender;

  public EpicService(EpicAppender epicAppender) {
    this.epicAppender = epicAppender;
  }

  public Epic append(User user, Long projectId, NewEpic newEpic, String key) {
    return epicAppender.append(user, projectId, newEpic, key);
  }
}
