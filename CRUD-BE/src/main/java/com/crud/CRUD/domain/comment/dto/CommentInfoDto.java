package com.crud.CRUD.domain.comment.dto;

import com.crud.CRUD.domain.board.dto.BoardInfoDto;
import com.crud.CRUD.domain.comment.entity.Comment;
import com.crud.CRUD.domain.post.dto.PostInfoDto;
import com.crud.CRUD.domain.user.dto.UserInfoDto;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CommentInfoDto {

  private Long commentId;
  private PostInfoDto postInfoDto;
  private UserInfoDto commentWriterInfoDto;
  private String commentContent;
  private LocalDateTime createdAt;
  private LocalDateTime modifiedAt;

  public CommentInfoDto(Comment comment) {
    this.commentId = comment.getCommentId();
    this.postInfoDto = new PostInfoDto(comment.getPost());
    this.commentWriterInfoDto = new UserInfoDto(comment.getUser());
    this.commentContent = comment.getCommentContent();
    this.createdAt = comment.getCreatedAt();
    this.modifiedAt = comment.getModifiedAt();
  }
}
