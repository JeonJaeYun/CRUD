import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Snackbar,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const PostCreatePage = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleCreatePost = async (event) => {
    event.preventDefault();
    // 확인 창 표시
    const confirmPost = window.confirm("게시글을 작성하시겠습니까?");
    if (!confirmPost) return; // 사용자가 취소하면 함수 종료

    setLoading(true);
    setError("");

    const userId = localStorage.getItem("userId");

    try {
      const response = await axios.post(`http://localhost:8080/api/posts`, {
        boardId: Number(boardId),
        userId,
        postTitle,
        postContent,
      });

      setSnackbarOpen(true);
      navigate(`/board/${boardId}`);
    } catch (err) {
      setError("게시글 작성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="md">
      <Box mt={5}>
        <Typography variant="h4" gutterBottom align="center" color="#1976d2">
          게시글 작성
        </Typography>
        <Card
          variant="outlined"
          sx={{ marginTop: 4, padding: 3, boxShadow: 3, borderRadius: 2 }}
        >
          <CardContent>
            <form onSubmit={handleCreatePost}>
              <TextField
                label="제목"
                variant="outlined"
                fullWidth
                margin="normal"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                  mb: 2, // 여백 추가
                }}
              />
              <TextField
                label="내용"
                variant="outlined"
                fullWidth
                margin="normal"
                multiline
                rows={5}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                  mb: 2, // 여백 추가
                }}
              />

              {error && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  mt: 2,
                  bgcolor: "#1976d2",
                  "&:hover": { bgcolor: "#115293" },
                }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "게시글 작성"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message="게시글이 작성되었습니다."
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        autoHideDuration={3000}
      />
    </Container>
  );
};

export default PostCreatePage;
