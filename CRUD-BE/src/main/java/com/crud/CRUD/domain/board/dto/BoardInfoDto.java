package com.crud.CRUD.domain.board.dto;

import com.crud.CRUD.domain.board.entity.Board;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class BoardInfoDto {

  private Long boardId;
  private String boardName;
  private LocalDateTime createdAt;
  private LocalDateTime modifiedAt;

  public BoardInfoDto(Board board) {
    this.boardId = board.getBoardId();
    this.boardName = board.getBoardName();
    this.createdAt = board.getCreatedAt();
    this.modifiedAt = board.getModifiedAt();
  }
}
