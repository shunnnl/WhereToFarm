import { createSlice } from '@reduxjs/toolkit';

// 초기 상태 - localStorage에서 토큰 확인하여 로그인 상태 결정
const checkInitialState = () => {
  const accessToken = localStorage.getItem('accessToken');
  const tokenExpires = localStorage.getItem('tokenExpires');
  
  // 토큰이 있고 만료되지 않았으면 로그인 상태로 간주
  if (accessToken && tokenExpires) {
    const expiryTime = new Date(tokenExpires);
    const currentTime = new Date();
    
    if (currentTime < expiryTime) {
      // 사용자 정보 가져오기
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      return { isLoggedIn: true, user };
    }
  }
  
  // 토큰이 없거나 만료됐으면 localStorage 정리
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tokenExpires');
  localStorage.removeItem('user');
  
  return { isLoggedIn: false, user: null };
};

const initialState = checkInitialState();

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