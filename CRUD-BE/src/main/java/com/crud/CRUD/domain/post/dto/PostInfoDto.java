package com.crud.CRUD.domain.post.dto;

import com.crud.CRUD.domain.board.dto.BoardInfoDto;
import com.crud.CRUD.domain.post.entity.Post;
import com.crud.CRUD.domain.user.dto.UserInfoDto;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PostInfoDto {

  private Long postId;
  private BoardInfoDto boardInfoDto;
  private UserInfoDto postWriterInfoDto;
  private String postTitle;
  private String postContent;
  private LocalDateTime createdAt;
  private LocalDateTime modifiedAt;

  public PostInfoDto(Post post) {
    this.postId = post.getPostId();
    this.boardInfoDto = new BoardInfoDto(post.getBoard());
    this.postWriterInfoDto = new UserInfoDto(post.getUser());
    this.postTitle = post.getPostTitle();
    this.postContent = post.getPostContent();
    this.createdAt = post.getCreatedAt();
    this.modifiedAt = post.getModifiedAt();
  }
}
