import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Box, Typography, CircularProgress, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const UserEditPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState("");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
        setUserInfo(response.data);
        setNickname(response.data.nickname);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSave = async () => {
    // 확인 메시지 표시
    const isConfirmed = window.confirm("유저 정보를 수정하시겠습니까?");
    if (!isConfirmed) return; // 취소 버튼 클릭 시 수정 취소

    try {
      await axios.put(`http://localhost:8080/api/users/${userId}`, {
        nickname,
      });
      navigate("/mypage"); // 저장 후 MyPage로 이동
    } catch (error) {
      console.error("Failed to update user data:", error);
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
    <Container maxWidth="sm" sx={{ marginTop: 10 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>유저 정보 수정</Typography>

        <TextField
          label="닉네임"
          fullWidth
          margin="normal"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />

        <Box mt={2}>
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            onClick={handleSave} 
            disabled={!nickname.trim()} // 닉네임이 비어있으면 비활성화
          >
            저장
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserEditPage;
