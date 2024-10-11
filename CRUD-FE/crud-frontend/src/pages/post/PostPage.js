import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Avatar,
  Button,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // 뒤로가기 아이콘
import EditIcon from "@mui/icons-material/Edit"; // 수정 아이콘
import DeleteIcon from "@mui/icons-material/Delete"; // 삭제 아이콘

const PostPage = () => {
  const { postId } = useParams(); // URL에서 postId 가져오기
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]); // 댓글 상태 추가
  const [commentContent, setCommentContent] = useState(""); // 댓글 입력 상태 추가
  const [editingCommentId, setEditingCommentId] = useState(null); // 수정할 댓글 ID
  const [page, setPage] = useState(0); // 댓글 페이지 상태
  const [hasMoreComments, setHasMoreComments] = useState(true); // 더 가져올 댓글이 있는지 상태

  const userId = localStorage.getItem("userId"); // 로컬 스토리지에서 userId 가져오기

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/posts/${postId}`
      ); // API 호출
      setPost(response.data); // 게시글 데이터 저장
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
          params: { page, size: 5 }, // 페이지와 크기 파라미터 추가
        }
      );
      const newComments = response.data.content;

      setComments((prevComments) =>
        initialFetch ? newComments : [...prevComments, ...newComments]
      ); // 초기 가져오기일 경우 새 댓글로 교체
      setHasMoreComments(newComments.length > 0); // 새로운 댓글이 있는지 여부 설정
    } catch (err) {
      setError("댓글을 불러오는 중 오류가 발생했습니다.");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent) return; // 댓글 내용이 없으면 리턴

    try {
      if (editingCommentId) {
        // 댓글 수정 로직
        const response = await axios.put(
          `http://localhost:8080/api/comments/${editingCommentId}`,
          {
            content: commentContent,
          }
        );
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.commentId === editingCommentId ? response.data : comment
          )
        );
        setEditingCommentId(null); // 수정 모드 종료
      } else {
        // 새 댓글 작성 로직
        const response = await axios.post(
          `http://localhost:8080/api/posts/${postId}/comments`,
          {
            content: commentContent,
          }
        );
        setComments((prevComments) => [...prevComments, response.data]); // 새 댓글 추가
      }
      setCommentContent(""); // 입력 필드 초기화
      setPage(0); // 댓글 작성 후 페이지를 초기화
      fetchComments(); // 댓글 작성 후 댓글 다시 가져오기
    } catch (err) {
      setError("댓글 작성 중 오류가 발생했습니다.");
    }
  };

  const handleEditComment = (comment) => {
    setCommentContent(comment.commentContent); // 댓글 내용 설정
    setEditingCommentId(comment.commentId); // 수정할 댓글 ID 설정
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8080/api/comments/${commentId}`); // 댓글 삭제 API 호출
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.commentId !== commentId)
      ); // 댓글 목록에서 삭제
    } catch (err) {
      setError("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchPost(); // 컴포넌트 마운트 시 게시글 데이터 가져오기
  }, [postId]);

  useEffect(() => {
    // 게시글을 가져온 후 댓글을 가져오기
    if (post) {
      fetchComments(true); // 게시글을 가져온 후 댓글 첫 페이지를 가져오도록 설정
    }
  }, [post]); // post가 변경될 때마다 댓글 첫 페이지 가져오기

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
    post; // updatedAt 추가

  return (
    <Container sx={{ marginTop: 4 }}>
      {" "}
      {/* 좌우 여백 설정 */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => window.history.back()}
        variant="outlined"
        sx={{
          mb: 3,
          borderColor: "#1976d2",
          color: "#1976d2",
          "&:hover": { backgroundColor: "#e3f2fd" },
        }}
      >
        뒤로 가기
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
        작성일: {new Date(createdAt).toLocaleDateString()} {/* 작성일 추가 */}
      </Typography>
      <Typography variant="body2" color="#777">
        수정일: {new Date(modifiedAt).toLocaleDateString()} {/* 수정일 추가 */}
      </Typography>
      <Typography
        variant="body1"
        sx={{ mt: 3, mb: 3, lineHeight: 1.6, color: "#444" }}
      >
        {postContent}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {/* 게시글 수정 및 삭제 버튼 */}
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
          >
            게시글 수정
          </Button>
          <Button
            variant="outlined"
            color="error"
            sx={{ "&:hover": { backgroundColor: "#ffebee" } }}
          >
            게시글 삭제
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
            fullWidth
            variant="outlined"
            placeholder="댓글을 입력하세요..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            sx={{
              mr: 1,
              height: "48px", // 높이 설정
              "& .MuiOutlinedInput-root": {
                height: "48px", // 높이 설정
              },
            }} // 오른쪽 여백 추가
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              width: "48px", // 너비 설정
              height: "48px", // 높이 설정
              backgroundColor: "#1976d2",
              color: "#fff",
              "&:hover": { backgroundColor: "#1565c0" },
              borderRadius: "8px", // 둥근 모서리
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)", // 그림자 효과 추가
            }}
          >
            작성
          </Button>
        </Box>

        <List>
          {comments.map((comment) => (
            <ListItem
              key={comment.commentId}
              sx={{ mb: 2, backgroundColor: "#f9f9f9", borderRadius: "5px" }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "#1976d2" }}>
                  {comment.commentWriterInfoDto.nickname.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={comment.commentWriterInfoDto.nickname || "익명"}
                secondary={comment.commentContent} // 댓글 내용
                secondaryTypographyProps={{ sx: { color: "#555" } }} // 댓글 내용 색상
              />
              <Box>
                {/* 댓글 수정 및 삭제 버튼 */}
                {comment.commentWriterInfoDto.userId === userId && (
                  <>
                    <Button
                      onClick={() => handleEditComment(comment)}
                      sx={{ color: "#1976d2", ml: 1 }}
                    >
                      <EditIcon fontSize="small" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteComment(comment.commentId)}
                      sx={{ color: "error.main" }}
                    >
                      <DeleteIcon fontSize="small" />
                    </Button>
                  </>
                )}
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default PostPage;
