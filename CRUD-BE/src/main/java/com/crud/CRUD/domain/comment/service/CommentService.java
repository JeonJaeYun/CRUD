package com.crud.CRUD.domain.comment.service;

import com.crud.CRUD.domain.comment.dto.CommentUpdateRequest;
import com.crud.CRUD.domain.comment.dto.CommentInfoDto;
import com.crud.CRUD.domain.comment.dto.CommentCreateRequest;
import com.crud.CRUD.domain.comment.entity.Comment;
import com.crud.CRUD.domain.comment.repository.CommentRepository;
import com.crud.CRUD.domain.post.entity.Post;
import com.crud.CRUD.domain.post.repository.PostRepository;
import com.crud.CRUD.domain.user.entity.User;
import com.crud.CRUD.domain.user.repository.UserRepository;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommentService {

  private final UserRepository userRepository;
  private final PostRepository postRepository;
  private final CommentRepository commentRepository;

  public CommentInfoDto createComment(CommentCreateRequest commentCreateRequest) {

    Post post = postRepository.findById(commentCreateRequest.getPostId())
        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));

    User user = userRepository.findById(String.valueOf(commentCreateRequest.getUserId()))
        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

    Comment newComment = new Comment();
    newComment.setPost(post);
    newComment.setUser(user);
    newComment.setCommentContent(commentCreateRequest.getCommentContent());

    commentRepository.save(newComment);

    return new CommentInfoDto(newComment);
  }

  public CommentInfoDto getCommentById(Long commentId) {

    Comment comment = commentRepository.findById(commentId)
        .orElseThrow(() -> new IllegalArgumentException("해당 ID의 댓글을 찾을 수 없습니다."));

    return new CommentInfoDto(comment);
  }

  public CommentInfoDto updateComment(Long commentId, CommentUpdateRequest commentUpdateRequest) {

    Comment comment = commentRepository.findById(commentId)
        .orElseThrow(() -> new IllegalArgumentException("해당 ID의 댓글을 찾을 수 없습니다."));

    comment.setCommentContent(commentUpdateRequest.getCommentContent());

    commentRepository.save(comment);

    return new CommentInfoDto(comment);
  }

  public void deleteComment(Long commentId) {

    Comment comment = commentRepository.findById(commentId)
        .orElseThrow(() -> new IllegalArgumentException("해당 ID의 댓글을 찾을 수 없습니다."));

    commentRepository.delete(comment);
  }

  public Page<CommentInfoDto> getCommentsByUserId(String userId, int page, int size) {

    User user = userRepository.findById(String.valueOf(userId))
        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

    Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

    Page<Comment> commentsPage = commentRepository.findByUser(user, pageable);

    return commentsPage.map(CommentInfoDto::new);
  }

  public Page<CommentInfoDto> getCommentsByPostId(Long postId, int page, int size) {

    Post post = postRepository.findById(postId)
        .orElseThrow(() -> new IllegalArgumentException("해당 ID의 게시글을 찾을 수 없습니다."));

    Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

    Page<Comment> commentsPage = commentRepository.findByPost(post, pageable);

    return commentsPage.map(CommentInfoDto::new);
  }
}
