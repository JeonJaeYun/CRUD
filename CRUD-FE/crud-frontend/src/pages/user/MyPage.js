import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Box, Paper, Avatar, List, ListItem, ListItemText, Divider, CircularProgress, Grid, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 hook
import DeleteIcon from "@mui/icons-material/Delete"; // 삭제 아이콘
import EditIcon from "@mui/icons-material/Edit"; // 수정 아이콘

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

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

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8080/api/comments/${commentId}`);
      setUserComments(userComments.filter(comment => comment.commentId !== commentId)); // 삭제 후 댓글 목록 갱신
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4, marginBottom: 4 }}>
      {/* 유저 정보 */}
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
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
          {/* 수정 아이콘 버튼 */}
          <IconButton onClick={() => navigate(`/user/${userId}/edit`)}>
            <EditIcon />
          </IconButton>
        </Box>
      </Paper>

      {/* 게시글과 댓글을 2열로 배치 */}
      <Grid container spacing={4}>
        {/* 유저의 게시글 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>내 게시글</Typography>
            {userPosts.length > 0 ? (
              <List>
                {userPosts.map((post) => (
                  <React.Fragment key={post.postId}>
                    <ListItem
                      onClick={() => navigate(`/board/${post.boardInfoDto.boardId}/post/${post.postId}`)}
                      sx={{ 
                          '&:hover': { 
                            cursor: 'pointer', 
                            backgroundColor: 'rgba(0, 0, 0, 0.04)', // 호버 시 배경색 변경
                            boxShadow: 2 // 호버 시 그림자 추가
                          } 
                        }}
                    >
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
        </Grid>

        {/* 유저의 댓글 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 3, height: '100%' }}>
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
                      {/* 댓글 삭제 버튼 (빨간색) */}
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteComment(comment.commentId)}
                        sx={{ color: "red" }} // 삭제 아이콘을 빨간색으로 변경
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography>작성한 댓글이 없습니다.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MyPage;
