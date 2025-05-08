package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.validation.ProjectKey;
import com.ssafy.taskit.api.validation.ProjectName;
import com.ssafy.taskit.domain.NewProject;
import jakarta.validation.constraints.NotNull;

public record AppendProjectRequest(
    @NotNull @ProjectName String name, @NotNull @ProjectKey String key) {
  public NewProject toNewProject() {
    return new NewProject(this.name(), this.key());
  }
}
