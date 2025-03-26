import React from "react";
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/toast-custom.css"

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
import Estate from "./pages/estate/Estate";
import { store } from './store';
import UserDeletePage from "./pages/auth/UserDeletePage";
import GuideBookPage from "./pages/etc/guidebook/GuideBookPage";

function App() {
  console.log("Store:", store);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/mentors" element={<MentorPage />} />
            <Route path="/crop-calculator" element={<CropCalculatorPage />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/estate" element={<Estate />} />
            <Route path="/guidebook" element={<GuideBookPage />} />
            <Route path="/account/delete" element={<UserDeletePage />} />
            <Route path="/mypage" element={<MyPage />}>
              <Route path="farmbti-report" element={<FarmbtiReport />} />
              <Route path="crop-calculate-report" element={<CropCalculateReport />} />
              <Route index element={<Navigate to="/mypage/farmbti-report" replace />} />
            </Route>
          </Routes>
          <div className="mt-24">
            <Footer />
          </div>
          <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
          />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;