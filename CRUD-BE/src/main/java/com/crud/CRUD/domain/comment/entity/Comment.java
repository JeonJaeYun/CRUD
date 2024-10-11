package com.crud.CRUD.domain.comment.entity;

import com.crud.CRUD.domain.post.entity.Post;
import com.crud.CRUD.domain.user.entity.User;
import com.crud.CRUD.global.common.BaseTimeEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Comment extends BaseTimeEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long commentId;

  private String commentContent;

  @ManyToOne
  @JoinColumn(name="post_id")
  private Post post;

  @ManyToOne
  @JoinColumn(name="user_id")
  private User user;
}
