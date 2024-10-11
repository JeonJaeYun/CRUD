import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Box, Paper, Avatar, List, ListItem, ListItemText, Divider, CircularProgress } from "@mui/material";

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 유저 정보, 게시글, 댓글 불러오기
        const [userResponse, postsResponse, commentsResponse] = await Promise.all([
          axios.get(`http://localhost:8080/api/users/${userId}`),
          axios.get(`http://localhost:8080/api/users/${userId}/posts`),
          axios.get(`http://localhost:8080/api/users/${userId}/comments`),
        ]);

        setUserInfo(userResponse.data);
        setUserPosts(postsResponse.data.content);
        setUserComments(commentsResponse.data.content);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      {/* 유저 정보 */}
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
        <Box display="flex" alignItems="center">
          <Avatar sx={{ width: 80, height: 80, marginRight: 2 }}>
            {userInfo.nickname[0]}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">{userInfo.nickname}</Typography>
            <Typography variant="body2" color="textSecondary">가입일: {new Date(userInfo.createdAt).toLocaleDateString()}</Typography>
            <Typography variant="body2" color="textSecondary">수정일: {new Date(userInfo.modifiedAt).toLocaleDateString()}</Typography>
          </Box>
        </Box>
      </Paper>

      {/* 유저의 게시글 */}
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>내 게시글</Typography>
        {userPosts.length > 0 ? (
          <List>
            {userPosts.map((post) => (
              <React.Fragment key={post.postId}>
                <ListItem>
                  <ListItemText
                    primary={post.postTitle}
                    secondary={`작성일: ${new Date(post.createdAt).toLocaleDateString()}`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography>작성한 게시글이 없습니다.</Typography>
        )}
      </Paper>

      {/* 유저의 댓글 */}
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>내 댓글</Typography>
        {userComments.length > 0 ? (
          <List>
            {userComments.map((comment) => (
              <React.Fragment key={comment.commentId}>
                <ListItem>
                  <ListItemText
                    primary={comment.commentContent}
                    secondary={`게시글 제목: ${comment.postInfoDto.postTitle}`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography>작성한 댓글이 없습니다.</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default MyPage;
