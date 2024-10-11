import React from "react";
import { Box } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TopBar from "./components/layout/TopBar";
import BoardBar from "./components/layout/BoardBar";
import Footer from "./components/layout/Footer";
import Router from './Router';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh', // 전체 화면 높이
          }}
        >
          <TopBar />
          <BoardBar />
          <Box sx={{ flexGrow: 1 }}> {/* 메인 콘텐츠 영역 */}
            <Router />
          </Box>
          <Footer />
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
