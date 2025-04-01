import { Provider } from "react-redux";
import { store } from "./store";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useEffect } from 'react';
// import { checkTokenExpiration } from './store/slices/authSlice';
import { useDispatch } from 'react-redux';
import "react-toastify/dist/ReactToastify.css";
import "./styles/toast-custom.css";

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
import FarmbtiReport from "./components/mypage/FarmbtiReport";
import CropCalculateReport from "./components/mypage/CropCalculateReport";
import EstatePage from "./pages/etc/estate/EstatePage";
import UserDeletePage from "./pages/auth/UserDeletePage";
import AuthRequiredPage from "./pages/etc/error-pages/AuthRequiredPage";
import GuideBookPage from "./pages/etc/guidebook/GuideBookPage";
import NewsPage from "./pages/news/NewsPage";
import SurveyIntroPage from "./pages/recommendation/survey/SurveyIntroPage";
import SurveyPage from "./pages/recommendation/survey/SurveyPage";
import ReportPage from "./pages/recommendation/report/ReportPage";
import SupportPolicyPage from "./pages/etc/support/SupportPolicyPage";
import EstateDetailPage from "./pages/etc/estate/EstateDetailPage";
import NotFoundPage from "./pages/etc/error-pages/NotFoundPage";



const isAuthenticated = () => {
  return localStorage.getItem("accessToken") !== null;
};

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <AuthRequiredPage />;
  }
  return children;
};

function App() {

  
  console.log("Store:", store);

  // // 리프레시 토큰 체크
  // useEffect(() => {
  //   // 앱 로드 시 바로 체크
  //   store.dispatch(checkTokenExpiration());
  //   // 주기적으로 토큰 만료 체크 (5분마다)
  //   const intervalId = setInterval(() => {
  //     store.dispatch(checkTokenExpiration());
  //   }, 5 * 60 * 1000);
    
  //   return () => clearInterval(intervalId);
  // }, []);  // useDispatch를 의존성 배열에서 제거

  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="App">
          <Navbar />

          {/* 페이지 내용 */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/mentors" element={<MentorPage />} />
            <Route path="/surveyintro" element={<SurveyIntroPage />} />
            <Route path="/survey" element={<SurveyPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route
              path="/crop-calculator"
              element={
                <ProtectedRoute>
                  <CropCalculatorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route path="/guidebook" element={<GuideBookPage />} />
            <Route path="/support" element={<SupportPolicyPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/estate" element={<EstatePage />} />
            <Route path="/estate/:estateId" element={<EstateDetailPage />} />
            <Route
              path="/account/delete"
              element={
                <ProtectedRoute>
                  <UserDeletePage />
                </ProtectedRoute>
              }
            />

            {/* MyPage 중첩 라우트 */}
            <Route
              path="/mypage"
              element={
                <ProtectedRoute>
                  <MyPage />
                </ProtectedRoute>
              }
            >
              <Route path="farmbti-report" element={<FarmbtiReport />} />
              <Route
                path="crop-calculate-report"
                element={<CropCalculateReport />}
              />
              {/* 기본 리다이렉트 */}
              <Route
                index
                element={<Navigate to="/mypage/farmbti-report" replace />}
              />
            </Route>
            <Route path="/account/delete" element={<UserDeletePage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <div className="mt-24">
            <Footer />
          </div>
          <ToastContainer
            position="top-center"
            autoClose={1000}
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
