package com.crud.CRUD.domain.comment.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class CommentUpdateRequest {

  @NotBlank(message = "댓글 내용은 필수입니다.")
  private String commentContent;
}
