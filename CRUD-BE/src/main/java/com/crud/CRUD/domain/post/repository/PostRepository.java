package com.crud.CRUD.domain.post.repository;

import com.crud.CRUD.domain.board.entity.Board;
import com.crud.CRUD.domain.post.entity.Post;
import com.crud.CRUD.domain.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {

  Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);
  Page<Post> findByBoardAndPostTitleContainingOrPostContentContaining(Board board, String title, String content, Pageable pageable);
  Page<Post> findByBoard(Board board, Pageable pageable);
  Page<Post> findByUser(User user, Pageable pageable);
}
