package com.crud.CRUD.domain.post.controller;

import com.crud.CRUD.domain.comment.dto.CommentInfoDto;
import com.crud.CRUD.domain.comment.service.CommentService;
import com.crud.CRUD.domain.post.dto.PostInfoDto;
import com.crud.CRUD.domain.post.dto.PostUpdateRequest;
import com.crud.CRUD.domain.post.dto.PostCreateRequest;
import com.crud.CRUD.domain.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {

  private final PostService postService;
  private final CommentService commentService;

  @PostMapping
  public ResponseEntity<String> createPost(@RequestBody PostCreateRequest postCreateRequest) {
    postService.createPost(postCreateRequest);
    return ResponseEntity.status(HttpStatus.CREATED).body("게시글 작성 완료");
  }

  @GetMapping
  public ResponseEntity<Page<PostInfoDto>> getAllPosts(@RequestParam int page, @RequestParam int size) {
    return ResponseEntity.status(HttpStatus.OK).body(postService.getAllPosts(page, size));
  }

  @GetMapping("/{postId}")
  public ResponseEntity<PostInfoDto> getPostById(@PathVariable Long postId) {
    return ResponseEntity.status(HttpStatus.OK).body(postService.getPostById(postId));
  }

  @PutMapping("/{postId}")
  public ResponseEntity<String> updatePost(@PathVariable Long postId, @RequestBody PostUpdateRequest postUpdateRequest) {
    postService.updatePost(postId, postUpdateRequest);
    return ResponseEntity.status(HttpStatus.OK).body("게시글 수정 완료");
  }

  @DeleteMapping("/{postId}")
  public ResponseEntity<String> deletePost(@PathVariable Long postId) {
    postService.deletePost(postId);
    return ResponseEntity.status(HttpStatus.OK).body("게시글 삭제 완료");
  }

  @GetMapping("/{postId}/comments")
  public ResponseEntity<Page<CommentInfoDto>> getCommentsByPostId(@PathVariable Long postId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    return ResponseEntity.status(HttpStatus.OK).body(commentService.getCommentsByPostId(postId, page, size));
  }
}
