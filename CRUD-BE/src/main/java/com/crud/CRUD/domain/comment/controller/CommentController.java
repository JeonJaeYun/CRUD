package com.crud.CRUD.domain.comment.controller;

import com.crud.CRUD.domain.comment.dto.CommentUpdateRequest;
import com.crud.CRUD.domain.comment.dto.CommentInfoDto;
import com.crud.CRUD.domain.comment.dto.CommentCreateRequest;
import com.crud.CRUD.domain.comment.service.CommentService;
import lombok.RequiredArgsConstructor;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CommentController {

  private final CommentService commentService;

  @PostMapping
  public ResponseEntity<String> createComment(@RequestBody CommentCreateRequest commentRequestDto) {
    commentService.createComment(commentRequestDto);
    return ResponseEntity.status(HttpStatus.CREATED).body("댓글 작성 완료");
  }

  @GetMapping("/{commentId}")
  public ResponseEntity<CommentInfoDto> getCommentById(@PathVariable Long commentId) {
    return ResponseEntity.status(HttpStatus.OK).body(commentService.getCommentById(commentId));
  }

  @PutMapping("/{commentId}")
  public ResponseEntity<String> updateComment(@PathVariable Long commentId, @RequestBody
  CommentUpdateRequest commentUpdateRequest) {
    commentService.updateComment(commentId, commentUpdateRequest);
    return ResponseEntity.status(HttpStatus.OK).body("댓글 수정 완료");
  }

  @DeleteMapping("/{commentId}")
  public ResponseEntity<String> deleteComment(@PathVariable Long commentId) {
    commentService.deleteComment(commentId);
    return ResponseEntity.status(HttpStatus.OK).body("댓글 삭제 완료");
  }
}
