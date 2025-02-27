package com.crud.CRUD.domain.board.repository;

import com.crud.CRUD.domain.board.entity.Board;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRepository extends JpaRepository<Board, Long> {

  boolean existsByBoardName(String boardName);
  Optional<Board> findByBoardName(String boardName);
}
