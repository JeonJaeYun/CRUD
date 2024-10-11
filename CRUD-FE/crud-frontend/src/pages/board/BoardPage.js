import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const BoardPage = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [board, setBoard] = useState(null); // 게시판 정보를 저장할 상태 추가
  const observer = useRef();

  const fetchPosts = useCallback(async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/boards/${boardId}/posts`,
        { params: { page, size: 10 } }
      );
      const newPosts = response.data.content;
  
      setPosts((prevPosts) => {
        const postIds = prevPosts.map(post => post.postId);
        const filteredPosts = newPosts.filter(post => !postIds.includes(post.postId));
        return [...prevPosts, ...filteredPosts];
      });
  
      setHasMore(newPosts.length > 0);
    } catch (err) {
      setError('게시글을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [boardId]);
  
  const fetchBoard = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/boards/${boardId}`);
      setBoard(response.data);
    } catch (err) {
      setError('게시판 정보를 불러오는 중 오류가 발생했습니다.');
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
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`); // 게시글 상세 페이지로 이동
  };

  if (error) {
    return <Typography>{error}</Typography>;
  }

  return (
    <Container>
      <Box mt={4} mb={2} textAlign="center">
        {board && ( // 게시판 이름이 있는 경우에만 표시
          <Typography variant="h4" gutterBottom fontWeight="bold">
            {board.boardName}
          </Typography>
        )}
        <Typography variant="body1" color="textSecondary">
          {hasMore ? '스크롤하여 더 많은 게시글을 확인하세요' : '더 이상 게시글이 없습니다'}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {posts.map((post, index) => {
          const { postId, postTitle, postContent, postWriterInfoDto, createdAt } = post;

          return (
            <Grid item xs={12} sm={6} key={postId} sx={{ mb: 2 }} ref={posts.length === index + 1 ? lastPostElementRef : null}>
              <Card
                variant="outlined"
                sx={{
                  height: '100%',
                  padding: 1,
                  backgroundColor: '#fafafa',
                  borderRadius: 2,
                  transition: '0.3s',
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 6 }
                }}
                onClick={() => handlePostClick(postId)} // 클릭 시 게시글 상세 페이지로 이동
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Avatar sx={{ mr: 2, bgcolor: '#1976d2' }}>{postWriterInfoDto.nickname.charAt(0)}</Avatar>
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
                      wordWrap: 'break-word',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 3,
                      overflow: 'hidden',
                    }}
                  >
                    {postContent}Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
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

      {/* Scroll to Top 버튼 */}
      {showScrollToTop && (
        <Button
          variant="contained"
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000,
            borderRadius: '50%', // 원형 버튼
            backgroundColor: '#282c34', // 배경색
            color: 'white', // 글자색
            width: 56, // 버튼 너비
            height: 56, // 버튼 높이
            boxShadow: 3,
            transition: 'background-color 0.3s, transform 0.3s',
            '&:hover': {
              backgroundColor: '#66bb6a', // hover시 색상 변경
              transform: 'scale(1.05)', // hover시 크기 변화
            },
          }}
          onClick={scrollToTop}
        >
          <ArrowUpwardIcon /> {/* 화살표 아이콘 */}
        </Button>
      )}
    </Container>
  );
};

export default BoardPage;
