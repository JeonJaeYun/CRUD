package com.crud.CRUD.domain.post.entity;

import com.crud.CRUD.domain.board.entity.Board;
import com.crud.CRUD.domain.comment.entity.Comment;
import com.crud.CRUD.domain.user.entity.User;
import com.crud.CRUD.global.common.BaseTimeEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Post extends BaseTimeEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long postId;

  private String postTitle;

  private String postContent;

  @ManyToOne
  @JoinColumn(name="board_id")
  private Board board;

  @ManyToOne
  @JoinColumn(name="user_id")
  private User user;

  @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
  private List<Comment> commentList;
}
