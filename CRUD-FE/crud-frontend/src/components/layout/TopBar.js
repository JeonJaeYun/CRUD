import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function TopBar() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  const handleLogoutClick = () => {
    const confirmLogout = window.confirm("정말 로그아웃하시겠습니까?");
    if (confirmLogout) {
      localStorage.removeItem("userId");
      localStorage.removeItem("nickname");
      navigate("/login");
    }
  };

  const userId = localStorage.getItem("userId");

  return (
    <Box
      sx={{
        backgroundColor: "#282c34",
        padding: "15px 0",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        color: "white",
      }}
    >
      <Container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "1.5rem",
            color: "#81C784",
            fontWeight: "bold",
            letterSpacing: "0.1em",
            cursor: "pointer",
          }}
          onClick={handleLogoClick}
        >
          StartLine
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          {userId ? (
            <>
              <Button 
                onClick={() => navigate("/mypage")} // 마이페이지로 이동
                color="inherit" 
                sx={{
                  '&:hover': {
                    backgroundColor: '#66BB6A',
                    color: 'black',
                  },
                }}
              >
                마이페이지
              </Button>
              <Button 
                onClick={handleLogoutClick} 
                color="inherit" 
                sx={{
                  '&:hover': {
                    backgroundColor: '#66BB6A',
                    color: 'black',
                  },
                }}
              >
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Button 
                onClick={handleLoginClick} 
                color="inherit" 
                sx={{
                  '&:hover': {
                    backgroundColor: '#66BB6A',
                    color: 'black',
                  },
                }}
              >
                로그인
              </Button>
              <Button 
                onClick={handleSignUpClick} 
                color="inherit" 
                sx={{
                  '&:hover': {
                    backgroundColor: '#66BB6A',
                    color: 'black',
                  },
                }}
              >
                회원가입
              </Button>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default TopBar;
