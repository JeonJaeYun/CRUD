import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/posts", {
          params: { page: 0, size: 12 },
        });
        setPosts(response.data.content);
      } catch (error) {
        setError("게시글을 가져오는 데 실패했습니다.");
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        align="left"
        sx={{
          fontFamily: "Poppins, sans-serif",
          fontSize: "1.5rem",
          color: "#282c34",
          fontWeight: "bold",
          textTransform: "uppercase",
          padding: "10px",
        }}
      >
        최신 게시글
      </Typography>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
          gap={3}
        >
          {posts.map((post, index) => (
            <Card
              key={index}
              component={Link}
              to={`/board/${post.boardInfoDto.boardId}/post/${post.postId}`}
              sx={{
                textDecoration: "none",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s",
                cursor: "pointer", // 카드 전체 영역에 커서 변환 추가
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: "bold",
                    color: "#7f8c8d",
                    marginBottom: "5px",
                  }}
                >
                  {post.boardInfoDto.boardName}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    textDecoration: "none",
                    color: "#2c3e50",
                    fontWeight: "bold",
                    marginBottom: "10px",
                    display: "block",
                  }}
                >
                  {post.postTitle}
                </Typography>
                <Box display="flex" justifyContent="space-between">
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#95a5a6",
                    }}
                  >
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#3498db",
                    }}
                  >
                    {post.postWriterInfoDto.nickname}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
}

export default Home;
