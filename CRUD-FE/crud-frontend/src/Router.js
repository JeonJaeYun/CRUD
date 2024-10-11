import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import BoardPage from "./pages/board/BoardPage"
import PostPage from "./pages/post/PostPage"
import PostCreatePage from "./pages/post/PostCreatePage";
import PostEditPage from "./pages/post/PostEditPage";
import MyPage from "./pages/user/MyPage";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/board/:boardId" element={<BoardPage />} />
      <Route path="/board/:boardId/create" element={<PostCreatePage />} />
      <Route path="/board/:boardId/post/:postId" element={<PostPage />} />
      <Route path="/board/:boardId/post/:postId/edit" element={<PostEditPage />} />
    </Routes>
  );
}

export default Router;
