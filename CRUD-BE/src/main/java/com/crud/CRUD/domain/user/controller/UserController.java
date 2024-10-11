package com.crud.CRUD.domain.user.controller;

import com.crud.CRUD.domain.comment.dto.CommentInfoDto;
import com.crud.CRUD.domain.comment.service.CommentService;
import com.crud.CRUD.domain.post.dto.PostInfoDto;
import com.crud.CRUD.domain.post.service.PostService;
import com.crud.CRUD.domain.user.dto.UserUpdateRequest;
import com.crud.CRUD.domain.user.dto.UserInfoDto;
import com.crud.CRUD.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

  private final UserService userService;
  private final PostService postService;
  private final CommentService commentService;

  // 유저 정보 조회
  @GetMapping("/{userId}")
  public ResponseEntity<UserInfoDto> getUser(@PathVariable String userId) {
    return ResponseEntity.status(HttpStatus.OK).body(userService.getUser(userId));
  }

  // 유저 정보 수정
  @PutMapping("/{userId}")
  public ResponseEntity<String> updateUser(@PathVariable String userId, @RequestBody UserUpdateRequest userUpdateRequest) {
    userService.updateUser(userId, userUpdateRequest);
    return ResponseEntity.status(HttpStatus.OK).body("유저 수정 완료");
  }

  // 유저 삭제
  @DeleteMapping("/{userId}")
  public ResponseEntity<String> deleteUser(@PathVariable String userId) {
    userService.deleteUser(userId);
    return ResponseEntity.status(HttpStatus.OK).body("탈퇴 완료");
  }

  // 유저의 게시글 조회
  @GetMapping("/{userId}/posts")
  public ResponseEntity<Page<PostInfoDto>> getPostsByUserId(@PathVariable String userId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    return ResponseEntity.status(HttpStatus.OK).body(postService.getPostsByUserId(userId, page, size));
  }

  // 유저의 댓글 조회
  @GetMapping("/{userId}/comments")
  public ResponseEntity<Page<CommentInfoDto>> getCommentsByUserId(@PathVariable String userId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    return ResponseEntity.status(HttpStatus.OK).body(commentService.getCommentsByUserId(userId, page, size));
  }
}
