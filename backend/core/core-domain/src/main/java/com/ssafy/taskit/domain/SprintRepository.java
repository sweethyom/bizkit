package com.ssafy.taskit.domain;

public interface SprintRepository {

  Sprint save(User user, Long projectId, NewSprint newSprint);
}
