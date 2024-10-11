import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: '',
    nickname: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/join', {
        userId: formData.userId,
        nickname: formData.nickname,
        password: formData.password,
      });

      if (response.status === 201) {
        alert('회원가입이 성공적으로 완료되었습니다!');
        navigate('/login');
      }
    } catch (error) {
      setError('회원가입 중 오류가 발생했습니다.');
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: 3,
          marginTop: '50px',
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
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
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
            label="닉네임"
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="비밀번호"
            type="password"
            name="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="비밀번호 확인"
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            sx={{ 
              marginTop: 2, 
              backgroundColor: '#81C784',
              '&:hover': {
                backgroundColor: '#66BB6A',
              },
            }}
          >
            회원가입
          </Button>
          <Button 
            fullWidth 
            variant="text" 
            sx={{ 
              marginTop: 1,
              '&:hover': {
                backgroundColor: '#E8F5E9',
                color: '#4CAF50',
              },
            }} 
            onClick={() => navigate('/login')}
          >
            로그인
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default SignUp;
