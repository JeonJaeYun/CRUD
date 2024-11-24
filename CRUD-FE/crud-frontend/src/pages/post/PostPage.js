import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Avatar,
  IconButton,
  Button,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  InputAdornment, // Import InputAdornment
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandLessIcon from "@mui/icons-material/ExpandLess"; // 위로가기 버튼 아이콘

const PostPage = () => {
  const { boardId } = useParams();
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const userId = localStorage.getItem("userId");
  const observer = useRef(); // IntersectionObserver 사용을 위한 ref
  const commentInputRef = useRef();

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/posts/${postId}`
      );
      setPost(response.data);
    } catch (err) {
      setError("게시글을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (initialFetch = false) => {
    if (!hasMoreComments) return; // 더 가져올 댓글이 없으면 리턴

    try {
      const response = await axios.get(
        `http://localhost:8080/api/posts/${postId}/comments`,
        {
          params: { page, size: 10 }, // 페이지와 크기 파라미터 추가
        }
      );
      const newComments = response.data.content;

      setComments((prevComments) => {
        const allComments = initialFetch
          ? newComments
          : [...prevComments, ...newComments];

        // 중복된 commentId 제거
        const uniqueComments = allComments.filter(
          (comment, index, self) =>
            index === self.findIndex((c) => c.commentId === comment.commentId)
        );
        return uniqueComments;
      });

      setHasMoreComments(newComments.length > 0); // 새로운 댓글이 있는지 여부 설정
    } catch (err) {
      setError("댓글을 불러오는 중 오류가 발생했습니다.");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent) return;

    if (editingCommentId) {
      await updateComment();
    } else {
      await createComment();
    }
  };

  const createComment = async () => {
    const nickname = localStorage.getItem("nickname");
    const userId = localStorage.getItem("userId");

    if (!userId || !nickname) {
      // 유저 정보가 없다면 로그인 필요 알림
      const confirmLogin = window.confirm("로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?");
      if (confirmLogin) {
        navigate("/login");  // 로그인 페이지로 이동
      }
    } else {
      const confirmCreate = window.confirm("댓글을 작성하시겠습니까?");
      if (!confirmCreate) return;
    
      try {
        const response = await axios.post(`http://localhost:8080/api/comments`, {
          postId: postId,
          userId: userId,
          commentContent: commentContent,
        });
    
        const newComment = response.data;  // 새로 작성된 댓글

        // 새 댓글을 기존 댓글 목록에 추가
        setComments((prevComments) => [newComment, ...prevComments]);

        // 댓글 작성 후 페이지 초기화 및 새로운 댓글 가져오기
        setPage(0);  // 페이지를 0으로 초기화
        setCommentContent("");  // 입력 필드 초기화
        fetchComments(true); // 새로운 댓글을 가져옴
      } catch (err) {
        setError("댓글 작성 중 오류가 발생했습니다.");
      }
    }
  };

  const updateComment = async () => {
    const confirmUpdate = window.confirm("댓글을 수정하시겠습니까?");
    if (!confirmUpdate) return;

    try {
      const response = await axios.put(
        `http://localhost:8080/api/comments/${editingCommentId}`,
        {
          commentContent: commentContent,
        }
      );
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.commentId === editingCommentId ? response.data : comment
        )
      );
      setCommentContent("");
      setEditingCommentId(null);
    } catch (err) {
      setError("댓글 수정 중 오류가 발생했습니다.");
    }
  };

  const handleEditComment = (comment) => {
    setCommentContent(comment.commentContent);
    setEditingCommentId(comment.commentId);
    // 댓글 입력 영역으로 스크롤
    if (commentInputRef.current) {
      const inputPosition = commentInputRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: inputPosition - 200, // 100px 만큼 위로 스크롤
        behavior: "smooth"
      });
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm("댓글을 삭제하시겠습니까?");
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`http://localhost:8080/api/comments/${commentId}`);
      // 댓글 삭제 후 페이지 초기화 및 새로운 댓글 가져오기
      setPage(0);  // 페이지를 0으로 초기화
      fetchComments(true);  // 새로운 댓글을 가져옴
    } catch (err) {
      setError("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleDeletePost = async () => {
    const confirmPost = window.confirm("게시글을 삭제하시겠습니까?");
    if (!confirmPost) return;

    try {
      await axios.delete(`http://localhost:8080/api/posts/${postId}`);
      // 게시글 삭제 후 게시글 목록 페이지로 이동
      navigate(`/board/${boardId}`);
    } catch (err) {
      setError("게시글 삭제 중 오류가 발생했습니다.");
    }
  };

  // 마지막 댓글 감지를 위한 IntersectionObserver 콜백
  const lastCommentRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreComments) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMoreComments]
  );

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

  useEffect(() => {
    fetchPost();
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [page]); // page가 변경될 때마다 댓글 가져오기

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ marginTop: 4 }}>
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return <Typography>{error}</Typography>;
  }

  if (!post) {
    return <Typography>게시글을 찾을 수 없습니다.</Typography>;
  }

  const { postTitle, postContent, postWriterInfoDto, createdAt, modifiedAt } =
    post;

  return (
    <Container sx={{ marginTop: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/board/${boardId}`)} // navigate로 수정
        variant="outlined"
        sx={{
          mb: 3,
          borderColor: "#1976d2",
          color: "#1976d2",
          "&:hover": { backgroundColor: "#e3f2fd" },
        }}
      >
        목록
      </Button>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#333" }}
      >
        {postTitle}
      </Typography>
      <Typography variant="subtitle1" fontWeight="bold" color="#555">
        작성자: {postWriterInfoDto.nickname}
      </Typography>
      <Typography variant="body2" color="#777">
        작성일: {new Date(createdAt).toLocaleDateString()}
      </Typography>
      <Typography variant="body2" color="#777">
        수정일: {new Date(modifiedAt).toLocaleDateString()}
      </Typography>
      <Typography
        variant="body1"
        sx={{ mt: 3, mb: 3, lineHeight: 1.6, color: "#444" }}
      >
        {postContent.split("\n").map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {postWriterInfoDto.userId === userId && (
        <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            color="primary"
            sx={{
              mr: 1,
              borderColor: "#1976d2",
              color: "#1976d2",
              "&:hover": { backgroundColor: "#e3f2fd" },
            }}
            onClick={() => navigate(`/board/${boardId}/post/${postId}/edit`)}
          >
            수정
          </Button>
          <Button
            variant="outlined"
            color="error"
            sx={{ "&:hover": { backgroundColor: "#ffebee" } }}
            onClick={handleDeletePost}
          >
            삭제
          </Button>
        </Box>
      )}
      <Box mt={4}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#333" }}
        >
          댓글
        </Typography>
        <Box
          component="form"
          onSubmit={handleCommentSubmit}
          display="flex"
          alignItems="center"
        >
          <TextField
            inputRef={commentInputRef}
            fullWidth
            variant="outlined"
            placeholder="댓글을 입력하세요..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            sx={{
              mr: 1,
              height: "48px",
              "& .MuiOutlinedInput-root": {
                height: "48px",
              },
            }}
            InputProps={{
              endAdornment: commentContent && ( // 댓글 내용이 있을 때만 "x" 버튼 보이기
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setCommentContent("")} // 클릭 시 입력 필드 비우기
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              width: "48px",
              height: "48px",
              backgroundColor: "#1976d2",
              color: "#fff",
              "&:hover": { backgroundColor: "#1565c0" },
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
            disabled={!commentContent} // 필드가 비어있으면 버튼 비활성화
          >
            작성
          </Button>
        </Box>

        <List>
          {comments.map((comment, index) => {
            const isLastComment = comments.length === index + 1;

            return (
              <ListItem
                ref={isLastComment ? lastCommentRef : null} // 마지막 댓글에 ref 추가
                key={comment.commentId}
                sx={{ mb: 2, backgroundColor: "#f9f9f9", borderRadius: "8px" }}
              >
                <ListItemAvatar>
                  <Avatar>{comment.commentWriterInfoDto.nickname[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={comment.commentWriterInfoDto.nickname}
                  secondary={comment.commentContent}
                />
                {comment.commentWriterInfoDto.userId === userId && (
                  <Box>
                    <Button onClick={() => handleEditComment(comment)}>
                      <EditIcon fontSize="small" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteComment(comment.commentId)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </Button>
                  </Box>
                )}
              </ListItem>
            );
          })}
        </List>

        {loading && <CircularProgress />}
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
      </Box>
    </Container>
  );
};

export default PostPage;
