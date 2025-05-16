package com.ssafy.taskit.domain;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class ComponentService {
  private final ComponentAppender componentAppender;

  private final ComponentReader componentReader;

  private final ComponentDeleter componentDeleter;

  private final ComponentModifier componentModifier;
  private final ProjectValidator projectValidator;
  private final MemberValidator memberValidator;

  private final ComponentValidator componentValidator;

  private final IssueService issueService;

  public ComponentService(
      ComponentAppender componentAppender,
      ComponentReader componentReader,
      ComponentModifier componentModifier,
      ComponentDeleter componentDeleter,
      ProjectValidator projectValidator,
      MemberValidator memberValidator,
      ComponentValidator componentValidator,
      IssueService issueService) {
    this.componentAppender = componentAppender;
    this.componentReader = componentReader;
    this.componentModifier = componentModifier;
    this.componentDeleter = componentDeleter;
    this.projectValidator = projectValidator;
    this.memberValidator = memberValidator;
    this.componentValidator = componentValidator;
    this.issueService = issueService;
  }

  public Component append(User user, Long projectId, NewComponent newComponent) {
    return componentAppender.append(user, projectId, newComponent);
  }

  public List<Component> findComponents(User user, Long projectId) {
    projectValidator.isProjectExists(projectId);
    memberValidator.validateMember(user, projectId);
    return componentReader.findComponents(projectId);
  }

  public void modifyComponent(User user, Long componentId, ModifyComponent modifyComponent) {
    componentModifier.modify(user, componentId, modifyComponent);
  }

  public void deleteComponent(User user, Long componentId) {
    componentValidator.isComponentExists(componentId);
    Component component = componentReader.findComponent(componentId);
    memberValidator.validateMember(user, component.projectId());
    List<Issue> issues = issueService.findComponentIssues(user, componentId);
    for (Issue issue : issues) {
      issueService.modifyIssueComponent(user, issue.id(), new ModifyIssueComponent(null));
    }
    componentDeleter.delete(componentId);
  }

  public Component findComponent(Long componentId) {
    if (componentId == null) {
      return Component.empty();
    }
    componentValidator.isComponentExists(componentId);
    return componentReader.findComponent(componentId);
  }

  public Map<Long, Component> mapByIds(List<Long> componentIds) {
    if (componentIds.isEmpty()) {
      return Collections.emptyMap();
    }
    List<Component> components = componentReader.findComponents(componentIds);
    return components.stream().collect(Collectors.toMap(Component::id, Function.identity()));
  }
}
