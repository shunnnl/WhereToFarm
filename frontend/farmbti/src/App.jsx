import React from "react";
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

// 컴포넌트 import
import Navbar from "./components/common/NavBar";
import Home from "./pages/home/Home";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import MentorPage from "./pages/mentor/MentorPage";
import CropCalculatorPage from "./pages/crop-calculator/CropCalculatorPage";
import Footer from "./components/common/Footer";
import Chat from "./pages/chat/Chat";
import MyPage from "./pages/mypage/MyPage";
import FarmbtiReport from "./components/MyPage/FarmbtiReport";
import CropCalculateReport from "./components/MyPage/CropCalculateReport";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        {/* 네비게이션 바는 동일한 너비와 패딩 사용 */}
        <Navbar />

        {/* 페이지 내용 */}
        <Routes>
          {/* 기본 페이지 */}
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/mentors" element={<MentorPage />} />
          <Route path="/crop-calculator" element={<CropCalculatorPage />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/mypage" element={<MyPage />}>
            {/* 중첩 라우트 정의 */}
            <Route path="farmbti-report" element={<FarmbtiReport />} />
            <Route path="crop-calculate-report" element={<CropCalculateReport />} />
            {/* 기본 리다이렉트 */}
            <Route
              index
              element={<Navigate to="/mypage/farmbti-report" replace />}
            />
          </Route>
        </Routes>

        {/* 푸터가 있다면 여기에 추가 */}
        <div className="mt-24">
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;