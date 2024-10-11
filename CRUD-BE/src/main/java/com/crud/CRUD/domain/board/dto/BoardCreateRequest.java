package com.crud.CRUD.domain.board.dto;

import com.crud.CRUD.domain.board.entity.Board;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class BoardCreateRequest {

  @NotBlank(message = "게시판 이름은 필수입니다.")
  private String boardName;
}
