import { createSlice } from '@reduxjs/toolkit';

// 초기 상태 설정 - 앱 시작 시 localStorage 확인하여 로그인 상태 결정
const initialState = {
  isLoggedIn: localStorage.getItem('accessToken') !== null,
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
};
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logout: (state) => {
      // 로그아웃 시 localStorage에서 모든 인증 데이터 제거
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpires');
      localStorage.removeItem('user');
      localStorage.removeItem("isMentor");
      
      state.isLoggedIn = false;
      state.user = null;
    },
    // 토큰 만료 체크 액션 추가
    checkTokenExpiration: (state) => {
      const accessToken = localStorage.getItem('accessToken');
      const tokenExpires = localStorage.getItem('tokenExpires');
      
      // 토큰이 없거나 만료됐으면 로그아웃 처리
      if (!accessToken || !tokenExpires) {
        state.isLoggedIn = false;
        state.user = null;
        return;
      }
      
      const expiryTime = new Date(tokenExpires);
      const currentTime = new Date();
      
      if (currentTime >= expiryTime) {
        // 토큰 만료 시 localStorage 정리
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpires');
        localStorage.removeItem('user');
        
        state.isLoggedIn = false;
        state.user = null;
      }
    }
  }
});

export const { login, logout, checkTokenExpiration } = authSlice.actions;

export default authSlice.reducer;