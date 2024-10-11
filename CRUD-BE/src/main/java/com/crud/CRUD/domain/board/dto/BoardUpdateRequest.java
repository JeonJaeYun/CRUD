package com.crud.CRUD.domain.board.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class BoardUpdateRequest {

  @NotBlank(message = "게시판 이름은 필수입니다.")
  private String boardName;
}
