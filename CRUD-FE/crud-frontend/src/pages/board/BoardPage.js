import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Grid,
  Container,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Box,
  Avatar,
  Button,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add"; // 추가 버튼 아이콘
import ExpandLessIcon from "@mui/icons-material/ExpandLess"; // 위로가기 버튼 아이콘

const BoardPage = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [board, setBoard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const observer = useRef();

  // 게시글 가져오기
  const fetchPosts = useCallback(
    async (page) => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/boards/${boardId}/posts`,
          { params: { page, size: 10, keyword: searchQuery } } // keyword를 사용
        );
        const newPosts = response.data.content;

        setPosts((prevPosts) => {
          const postIds = prevPosts.map((post) => post.postId);
          const filteredPosts = newPosts.filter(
            (post) => !postIds.includes(post.postId)
          );
          return [...prevPosts, ...filteredPosts];
        });

        setHasMore(newPosts.length > 0);
      } catch (err) {
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    },
    [boardId, searchQuery]
  );

  // 게시판 정보 가져오기
  const fetchBoard = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/boards/${boardId}`
      );
      setBoard(response.data);
    } catch (err) {
      setError("게시판 정보를 불러오는 중 오류가 발생했습니다.");
    }
  }, [boardId]);

  useEffect(() => {
    setPosts([]);
    setPage(0);
    setHasMore(true);
    window.scrollTo(0, 0);
    fetchPosts(0);
    fetchBoard();
  }, [boardId, fetchPosts, fetchBoard]);

  const lastPostElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    if (page > 0) {
      fetchPosts(page);
    }
  }, [page]);

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowScrollToTop(true);
    } else {
      setShowScrollToTop(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handlePostClick = (postId) => {
    navigate(`/board/${boardId}/post/${postId}`);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setPosts([]); // 검색 시 기존 게시글 목록 초기화
    setPage(0); // 페이지도 초기화
    fetchPosts(0); // 검색 후 첫 페이지 게시글 가져오기
  };

  const handleCreatePost = () => {
    const nickname = localStorage.getItem("nickname");
    const userId = localStorage.getItem("userId");

    if (!userId || !nickname) {
      // 유저 정보가 없다면 로그인 필요 알림
      const confirmLogin = window.confirm("로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?");
      if (confirmLogin) {
        navigate("/login");  // 로그인 페이지로 이동
      }
    } else {
      // 유저 정보가 있으면 글쓰기 페이지로 이동
      navigate(`/board/${boardId}/create`);
    }
  };

  if (error) {
    return <Typography>{error}</Typography>;
  }

  return (
    <Container>
      <Box mt={4} mb={2} textAlign="center">
        {board && (
          <Typography variant="h4" gutterBottom fontWeight="bold">
            {board.boardName}
          </Typography>
        )}
        <Typography variant="body1" color="textSecondary">
          {hasMore
            ? "스크롤하여 더 많은 게시글을 확인하세요"
            : "더 이상 게시글이 없습니다"}
        </Typography>
      </Box>

      <Box mt={3} mb={4} textAlign="center">
        <form onSubmit={handleSearchSubmit}>
          <TextField
            variant="outlined"
            placeholder="게시글 검색..."
            value={searchQuery}
            onChange={handleSearchChange}
            size="small"
            sx={{
              mr: 1,
              width: "300px",
              height: "40px", // 높이를 설정
              "& .MuiOutlinedInput-root": {
                // 테두리 높이 통일
                height: "40px",
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              height: "40px", // 높이를 설정
            }}
          >
            검색
          </Button>
        </form>
      </Box>

      <Grid container spacing={3}>
        {posts.map((post, index) => {
          const {
            postId,
            postTitle,
            postContent,
            postWriterInfoDto,
            createdAt,
          } = post;

          return (
            <Grid
              item
              xs={12}
              sm={6}
              key={postId}
              sx={{ mb: 2 }}
              ref={posts.length === index + 1 ? lastPostElementRef : null}
            >
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  padding: 1,
                  backgroundColor: "#fafafa",
                  borderRadius: 2,
                  transition: "0.3s",
                  cursor: "pointer",
                  "&:hover": { boxShadow: 6 },
                }}
                onClick={() => handlePostClick(postId)}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ mr: 2, bgcolor: "#1976d2" }}>
                      {postWriterInfoDto.nickname.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {postWriterInfoDto.nickname}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {new Date(createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {postTitle}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      wordWrap: "break-word",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 3,
                      overflow: "hidden",
                    }}
                  >
                    {postContent.split("\n").map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {loading && (
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress />
        </Box>
      )}

      {showScrollToTop && (
        <Button
          variant="contained"
          sx={{
            position: "fixed",
            bottom: 20,
            left: 20,
            zIndex: 1000,
            borderRadius: "50%",
            backgroundColor: "#282c34",
            color: "white",
            width: 56,
            height: 56,
            boxShadow: 3,
            transition: "background-color 0.3s, transform 0.3s",
            "&:hover": {
              backgroundColor: "#66bb6a",
              transform: "scale(1.05)",
            },
          }}
          onClick={scrollToTop}
        >
          <ExpandLessIcon /> {/* 둥근 세모 아이콘 */}
        </Button>
      )}

      {/* 글쓰기 버튼에 '+' 아이콘 추가 */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreatePost}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1000,
          borderRadius: "50%",
          width: 56,
          height: 56,
          boxShadow: 3,
        }}
      >
        <AddIcon />
      </Button>
    </Container>
  );
};

export default BoardPage;
