package com.ssafy.taskit.auth.domain.image;

import java.util.List;

public interface AuthFileClient {

  String uploadFile(AuthFile file);

  List<String> uploadFiles(List<AuthFile> files);
}
