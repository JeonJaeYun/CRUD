package com.crud.CRUD.domain.post.service;

import com.crud.CRUD.domain.board.entity.Board;
import com.crud.CRUD.domain.board.repository.BoardRepository;
import com.crud.CRUD.domain.comment.dto.CommentInfoDto;
import com.crud.CRUD.domain.post.dto.PostInfoDto;
import com.crud.CRUD.domain.post.dto.PostUpdateRequest;
import com.crud.CRUD.domain.post.dto.PostCreateRequest;
import com.crud.CRUD.domain.post.entity.Post;
import com.crud.CRUD.domain.post.repository.PostRepository;
import com.crud.CRUD.domain.user.entity.User;
import com.crud.CRUD.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostService {

  private final PostRepository postRepository;
  private final BoardRepository boardRepository;
  private final UserRepository userRepository;

  public void createPost(PostCreateRequest postCreateRequest) {

    Board board = boardRepository.findById(postCreateRequest.getBoardId())
        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시판입니다."));

    User user = userRepository.findById(String.valueOf(postCreateRequest.getUserId()))
        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

    Post newPost = new Post();
    newPost.setBoard(board);
    newPost.setUser(user);
    newPost.setPostTitle(postCreateRequest.getPostTitle());
    newPost.setPostContent(postCreateRequest.getPostContent());

    postRepository.save(newPost);
  }

  public Page<PostInfoDto> getAllPosts(int page, int size) {
    Page<Post> posts = postRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size)); // 페이지 단위로 게시글 가져오기
    return posts.map(PostInfoDto::new);
  }

  public PostInfoDto getPostById(Long postId) {

    Post post = postRepository.findById(postId)
        .orElseThrow(() -> new IllegalArgumentException("해당 ID의 게시글을 찾을 수 없습니다."));

    return new PostInfoDto(post);
  }

  public void updatePost(Long postId, PostUpdateRequest postUpdateRequest) {

    Post post = postRepository.findById(postId)
        .orElseThrow(() -> new IllegalArgumentException("해당 ID의 게시글을 찾을 수 없습니다."));

    post.setPostTitle(postUpdateRequest.getPostTitle());
    post.setPostContent(postUpdateRequest.getPostContent());

    postRepository.save(post);
  }

  public void deletePost(Long postId) {

    Post post = postRepository.findById(postId)
        .orElseThrow(() -> new IllegalArgumentException("해당 ID의 게시글을 찾을 수 없습니다."));

    postRepository.delete(post);
  }

  public Page<PostInfoDto> getPostsByUserId(String userId, int page, int size) {

    User user = userRepository.findById(String.valueOf(userId))
        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

    Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

    Page<Post> postsPage = postRepository.findByUser(user, pageable);

    return postsPage.map(PostInfoDto::new);
  }

  public Page<PostInfoDto> getPostsByBoardId(Long boardId, int page, int size) {

    Board board = boardRepository.findById(boardId)
        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시판입니다."));

    Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

    Page<Post> postsPage = postRepository.findByBoard(board, pageable);

    return postsPage.map(PostInfoDto::new);
  }
}
