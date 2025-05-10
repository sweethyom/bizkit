package com.ssafy.taskit.domain;

import java.time.LocalDateTime;
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

  public List<Project> readProjectsByRecentView(User user, ProjectSort sortType) {
    List<Long> projectIds = projectRepository.findUserProjectIds(user, sortType);
    return projectRepository.findAllByIds(projectIds);
  }

  public ProjectDetail readProject(User user, Long id, boolean isLeader) {
    memberRepository.updateLastAccessedAt(user.id(), id, LocalDateTime.now());
    return projectRepository.findProject(user, id, isLeader);
  }
}
