import React from "react";
import { Box, Container, Typography, Link, IconButton } from "@mui/material";
import { Facebook, Twitter, Instagram } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const LogoTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "Poppins, sans-serif",
  color: "#81C784",
  fontWeight: "bold",
  fontSize: "1.5rem",
  letterSpacing: "0.1em",
  textAlign: "center",
}));

function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: "#282c34",
        padding: "20px 0",
        position: "relative", // 고정 대신 상대적 위치로 변경
        width: "100%",
        color: "white",
        marginTop: "50px", // 페이지의 나머지 내용이 끝난 후 Footer가 밀리도록 설정
      }}
    >
      <Container>
        <LogoTypography variant="h6" align="center" gutterBottom>
          StartLine
        </LogoTypography>
        <Typography
          variant="body2"
          align="center"
          gutterBottom
          sx={{
            fontSize: "0.7rem",
          }}
        >
          &copy; 2024 StartLine. All rights reserved.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 1 }}>
          <IconButton
            component={Link}
            href="https://www.facebook.com"
            target="_blank"
            color="inherit"
            aria-label="Facebook"
          >
            <Facebook />
          </IconButton>
          <IconButton
            component={Link}
            href="https://www.twitter.com"
            target="_blank"
            color="inherit"
            aria-label="Twitter"
          >
            <Twitter />
          </IconButton>
          <IconButton
            component={Link}
            href="https://www.instagram.com"
            target="_blank"
            color="inherit"
            aria-label="Instagram"
          >
            <Instagram />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
