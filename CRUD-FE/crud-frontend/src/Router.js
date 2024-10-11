import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import BoardPage from "./pages/board/BoardPage"
import PostPage from "./pages/post/PostPage"

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/board/:boardId" element={<BoardPage />} />
      <Route path="/post/:postId" element={<PostPage />} />
    </Routes>
  );
}

export default Router;
