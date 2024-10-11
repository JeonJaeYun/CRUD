package com.crud.CRUD.domain.post.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class PostUpdateRequest {

  @NotBlank(message = "게시글 제목은 필수입니다.")
  private String postTitle;
  @NotBlank(message = "게시글 내용은 필수입니다.")
  private String postContent;
}
