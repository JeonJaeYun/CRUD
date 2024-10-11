import React, { useEffect, useState } from "react";
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

const PostEditPage = () => {
  const { boardId, postId } = useParams();
  const navigate = useNavigate();
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // 게시글 데이터 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/posts/${postId}`);
        setPostTitle(response.data.postTitle);
        setPostContent(response.data.postContent);
      } catch (err) {
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleEditPost = async (event) => {
    event.preventDefault();
    const confirmEdit = window.confirm("게시글을 수정하시겠습니까?");
    if (!confirmEdit) return;

    setLoading(true);
    setError("");

    try {
      await axios.put(`http://localhost:8080/api/posts/${postId}`, {
        postTitle,
        postContent,
      });

      setSnackbarOpen(true);
      navigate(`/board/${boardId}/post/${postId}`);
    } catch (err) {
      setError("게시글 수정 중 오류가 발생했습니다.");
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
          게시글 수정
        </Typography>
        <Card
          variant="outlined"
          sx={{ marginTop: 4, padding: 3, boxShadow: 3, borderRadius: 2 }}
        >
          <CardContent>
            <form onSubmit={handleEditPost}>
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
                  mb: 2,
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
                  mb: 2,
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
                  "게시글 수정"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message="게시글이 수정되었습니다."
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

export default PostEditPage;
