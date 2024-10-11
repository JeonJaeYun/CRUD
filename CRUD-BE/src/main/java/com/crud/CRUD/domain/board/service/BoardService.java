package com.crud.CRUD.domain.board.service;

import com.crud.CRUD.domain.board.dto.BoardInfoDto;
import com.crud.CRUD.domain.board.dto.BoardUpdateRequest;
import com.crud.CRUD.domain.board.dto.BoardCreateRequest;
import com.crud.CRUD.domain.board.entity.Board;
import com.crud.CRUD.domain.board.repository.BoardRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BoardService {

  private final BoardRepository boardRepository;

  public void createBoard(BoardCreateRequest boardCreateRequest) {

    Board newBoard = new Board();
    newBoard.setBoardName(boardCreateRequest.getBoardName());

    boardRepository.save(newBoard);
  }

  public List<BoardInfoDto> getAllBoards() {

    List<Board> boards = boardRepository.findAll();

    return boards.stream()
        .map(BoardInfoDto::new)
        .collect(Collectors.toList());
  }

  public BoardInfoDto getBoardById(Long boardId) {

    Board board =  boardRepository.findById(boardId)
        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시판입니다."));

    return new BoardInfoDto(board);
  }

  public void updateBoard(Long boardId, BoardUpdateRequest boardUpdateRequest) {

    Board board = boardRepository.findById(boardId)
        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시판입니다."));

    board.setBoardName(boardUpdateRequest.getBoardName());

    boardRepository.save(board);
  }

  public void deleteBoard(Long boardId) {

    Board board = boardRepository.findById(boardId)
        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시판입니다."));

    boardRepository.delete(board);
  }
}
