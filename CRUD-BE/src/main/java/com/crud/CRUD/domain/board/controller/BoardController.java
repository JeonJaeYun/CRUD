package com.crud.CRUD.domain.board.controller;

import com.crud.CRUD.domain.board.dto.BoardInfoDto;
import com.crud.CRUD.domain.board.dto.BoardUpdateRequest;
import com.crud.CRUD.domain.board.dto.BoardCreateRequest;
import com.crud.CRUD.domain.board.entity.Board;
import com.crud.CRUD.domain.board.service.BoardService;
import com.crud.CRUD.domain.post.dto.PostInfoDto;
import com.crud.CRUD.domain.post.service.PostService;
import java.util.List;
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
@RequestMapping("/api/boards")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class BoardController {

  private final BoardService boardService;
  private final PostService postService;

  @PostMapping
  public ResponseEntity<String> createBoard(@RequestBody BoardCreateRequest boardCreateRequest) {
    boardService.createBoard(boardCreateRequest);
    return ResponseEntity.status(HttpStatus.CREATED).body("게시판 생성 완료");
  }

  @GetMapping
  public ResponseEntity<List<BoardInfoDto>> getAllBoards() {
    return ResponseEntity.status(HttpStatus.OK).body(boardService.getAllBoards());
  }

  @GetMapping("/{boardId}")
  public ResponseEntity<BoardInfoDto> getBoardById(@PathVariable Long boardId) {
    return ResponseEntity.status(HttpStatus.OK).body(boardService.getBoardById(boardId));
  }

  @PutMapping("/{boardId}")
  public ResponseEntity<String> updateBoard(@PathVariable Long boardId, @RequestBody BoardUpdateRequest boardUpdateRequest) {
    boardService.updateBoard(boardId, boardUpdateRequest);
    return ResponseEntity.status(HttpStatus.OK).body("게시판 수정 완료");
  }

  @DeleteMapping("/{boardId}")
  public ResponseEntity<String> deleteBoard(@PathVariable Long boardId) {
    boardService.deleteBoard(boardId);
    return ResponseEntity.status(HttpStatus.OK).body("게시판 삭제 완료");
  }

  @GetMapping("/{boardId}/posts")
  public ResponseEntity<Page<PostInfoDto>> getPostsByBoardId(
      @PathVariable Long boardId,
      @RequestParam(required = false) String keyword, // keyword 검색
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {

    return ResponseEntity.status(HttpStatus.OK).body(postService.getPostsByBoardId(boardId, keyword, page, size));
  }
}
