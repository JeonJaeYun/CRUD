package com.crud.CRUD.domain.comment.repository;

import com.crud.CRUD.domain.comment.entity.Comment;
import com.crud.CRUD.domain.post.entity.Post;
import com.crud.CRUD.domain.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {

  Page<Comment> findByPost(Post post, Pageable pageable);
  Page<Comment> findByUser(User user, Pageable pageable);
}
