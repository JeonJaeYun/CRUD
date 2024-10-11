// BoardBar.js
import React, { useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function BoardBar() {
  const [boards, setBoards] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/boards");
        setBoards(response.data);
      } catch (error) {
        console.error("게시판 데이터를 가져오는 데 오류가 발생했습니다:", error);
      }
    };

    fetchBoards();
  }, []);

  const handleBoardClick = (boardId) => {
    navigate(`/board/${boardId}`);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#282c34",
        padding: "10px 0",
        position: "sticky", // sticky로 고정
        top: "68.39px", // TopBar의 높이를 고려하여 적절하게 조정
        zIndex: 1000,
      }}
    >
      <Container
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {boards.map((board) => (
          <Typography
            key={board.boardId} // 고유한 key 설정
            onClick={() => handleBoardClick(board.boardId)}
            sx={{
              margin: "8px 16px",
              color: location.pathname === `/board/${board.boardId}` ? '#81C784' : 'white',
              cursor: "pointer",
              fontFamily: "Poppins, sans-serif",
              fontWeight: location.pathname === `/board/${board.boardId}` ? 'bold' : 'normal',
              '&:hover': {
                color: '#81C784',
                fontWeight: 'bold',
              },
            }}
          >
            {board.boardName}
          </Typography>
        ))}
      </Container>
    </Box>
  );
}

export default BoardBar;
