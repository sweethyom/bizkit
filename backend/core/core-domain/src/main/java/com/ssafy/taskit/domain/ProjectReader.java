package com.ssafy.taskit.domain;

import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class ProjectReader {
  private final ProjectRepository projectRepository;
  private final MemberRepository memberRepository;

  public ProjectReader(ProjectRepository projectRepository, MemberRepository memberRepository) {
    this.projectRepository = projectRepository;
    this.memberRepository = memberRepository;
  }

  public List<Project> readProjectsByRecentView(User user) {
    List<Long> projectIds = memberRepository.findProjectIdsByUserIdOrderByViewedAtDesc(user.id());
    return projectRepository.findAllById(projectIds);
  }
}
