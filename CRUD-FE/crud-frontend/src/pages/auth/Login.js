import React, { useState } from "react";
import { Box, Container, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/api/login", {
        userId: formData.userId,
        password: formData.password,
      });

      if (response.status === 200) {
        const { userId, nickname } = response.data; // API 응답에서 userId와 nickname 추출
        localStorage.setItem("userId", userId); // 로컬 스토리지에 userId 저장
        localStorage.setItem("nickname", nickname); // 로컬 스토리지에 nickname 저장
        
        alert("로그인에 성공했습니다!");
        navigate("/");
      }
    } catch (error) {
      setError("로그인 중 오류가 발생했습니다.");
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: 3,
          marginTop: "100px",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Poppins, sans-serif",
            color: "#81C784",
            fontSize: "1.6rem",
            fontWeight: "bold",
            letterSpacing: "0.1em",
            cursor: "pointer",
            marginBottom: 2,
          }}
          onClick={() => navigate("/")}
        >
          StartLine
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="아이디"
            type="text"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="비밀번호"
            type="password"
            name="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              marginTop: 2,
              backgroundColor: "#81C784",
              "&:hover": {
                backgroundColor: "#66BB6A",
              },
            }}
          >
            로그인
          </Button>
          <Button
            fullWidth
            variant="text"
            sx={{
              marginTop: 1,
              "&:hover": {
                backgroundColor: "#E8F5E9",
                color: "#4CAF50",
              },
            }}
            onClick={() => navigate("/signup")}
          >
            회원가입
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default Login;
