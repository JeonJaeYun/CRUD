package com.crud.CRUD.domain.comment.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CommentCreateRequest {

  @NotBlank(message = "게시글 ID는 필수입니다.")
  private Long postId;
  @NotBlank(message = "유저 ID는 필수입니다.")
  private String userId;
  @NotBlank(message = "댓글 내용은 필수입니다.")
  private String commentContent;
}
