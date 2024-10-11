package com.crud.CRUD;

import com.crud.CRUD.domain.board.entity.Board;
import com.crud.CRUD.domain.board.repository.BoardRepository;
import com.crud.CRUD.domain.comment.entity.Comment;
import com.crud.CRUD.domain.comment.repository.CommentRepository;
import com.crud.CRUD.domain.post.entity.Post;
import com.crud.CRUD.domain.post.repository.PostRepository;
import com.crud.CRUD.domain.user.entity.User;
import com.crud.CRUD.domain.user.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class InitDB {

  private final BoardRepository boardRepository;
  private final UserRepository userRepository;
  private final PostRepository postRepository;
  private final CommentRepository commentRepository;

  @PostConstruct
  public void init() {
    createInitialBoards();
    createInitialUsers();
    createInitialPosts();
    createInitialComments();
  }

  private void createInitialBoards() {
    if (!boardRepository.existsByBoardName("채용정보")) {
      boardRepository.save(new Board("채용정보"));
    }
    if (!boardRepository.existsByBoardName("자유게시판")) {
      boardRepository.save(new Board("자유게시판"));
    }
    if (!boardRepository.existsByBoardName("Q&A")) {
      boardRepository.save(new Board("Q&A"));
    }
  }

  private void createInitialUsers() {
    for (int i = 1; i <= 100; i++) {
      String userId = "user" + i;
      if (!userRepository.existsById(userId)) {
        User user = new User();
        user.setUserId(userId);
        user.setPassword("password" + i); // 비밀번호는 실제 환경에서는 안전하게 관리해야 함
        user.setNickname("닉네임" + i);
        userRepository.save(user);
      }
    }
  }

  private void createInitialPosts() {
    List<Board> boards = boardRepository.findAll(); // 저장된 모든 게시판 가져오기
    for (int i = 1; i <= 100; i++) {
      Post post = new Post();
      post.setPostTitle("게시물 제목 " + i);
      post.setPostContent("게시물 내용 " + i);
      // 랜덤하게 게시판 할당
      post.setBoard(boards.get(i % boards.size()));
      // 랜덤하게 사용자 할당
      post.setUser(userRepository.findById("user" + (i % 10 + 1)).orElse(null));
      postRepository.save(post);
    }
  }

  private void createInitialComments() {
    List<Post> posts = postRepository.findAll(); // 저장된 모든 게시물 가져오기
    for (int i = 1; i <= 3000; i++) {
      Comment comment = new Comment();
      comment.setCommentContent("댓글 내용 " + i);
      // 랜덤하게 게시물 할당
      comment.setPost(posts.get(i % posts.size()));
      // 랜덤하게 사용자 할당
      comment.setUser(userRepository.findById("user" + (i % 10 + 1)).orElse(null));
      commentRepository.save(comment);
    }
  }
}
