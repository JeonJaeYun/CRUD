package com.crud.CRUD.domain.post.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PostCreateRequest {

  @NotBlank(message = "게시판 ID는 필수입니다.")
  private Long boardId;
  @NotBlank(message = "유저 ID는 필수입니다.")
  private String userId;
  @NotBlank(message = "게시글 제목은 필수입니다.")
  private String postTitle;
  @NotBlank(message = "게시글 내용은 필수입니다.")
  private String postContent;
}
