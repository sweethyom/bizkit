package com.ssafy.taskit.api.controller;

public record InvitationProjectResponse(
    Long id, String name, String image, LeaderResponse leader) {}
