import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice';
import LoginPage from './LoginPage';
import { publicAxios } from '../../API/common/AxiosInstance';

// mockNavigate 함수 정의 - vi.mock 전에 정의해야 함
const mockNavigate = vi.fn();

// react-router-dom 부분적 모킹 - useNavigate만 모킹하고 나머지는 실제 구현 유지
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// publicAxios 모킹
vi.mock('../../API/common/AxiosInstance', () => ({
  publicAxios: {
    post: vi.fn()
  }
}));

// 토스트 모킹
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

// 테스트를 위한 Redux 스토어 생성
const createTestStore = () => configureStore({
  reducer: {
    auth: authReducer
  }
});

// 테스트 래퍼 컴포넌트
const renderWithProviders = (ui, { store = createTestStore() } = {}) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </Provider>
  );
};

describe('LoginPage', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders the login form correctly', () => {
    renderWithProviders(<LoginPage />);
    
    // 폼 요소들이 렌더링 되었는지 확인
    expect(screen.getByLabelText(/이메일/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/비밀번호/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /로그인/i })).toBeInTheDocument();
    expect(screen.getByText(/계정이 없으신가요?/i)).toBeInTheDocument();
    expect(screen.getByText(/회원가입/i)).toBeInTheDocument();
  });
  
  it('validates email and password inputs', async () => {
    renderWithProviders(<LoginPage />);
    
    // 이메일, 비밀번호 입력 없이 제출
    fireEvent.click(screen.getByRole('button', { name: /로그인/i }));
    
    // 유효성 검사 에러 메시지 확인
    expect(await screen.findByText(/이메일을 입력해주세요/i)).toBeInTheDocument();
    expect(await screen.findByText(/비밀번호를 입력해주세요/i)).toBeInTheDocument();
    
    // 잘못된 이메일 형식 입력
    fireEvent.change(screen.getByLabelText(/이메일/i), { target: { value: 'invalidEmail' } });
    fireEvent.click(screen.getByRole('button', { name: /로그인/i }));
    
    // 이메일 형식 에러 메시지 확인
    expect(await screen.findByText(/유효한 이메일 형식이 아닙니다/i)).toBeInTheDocument();
  });
  
  it('handles successful login', async () => {
    // 로그인 성공 응답 모킹
    const mockResponse = {
      success: true,
      data: {
        token: {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          accessTokenExpiresInForHour: '1h'
        },
        id: 1,
        email: 'test@example.com',
        name: '테스트 유저',
        address: '서울시',
        gender: 'male',
        profileImage: 'profile.jpg'
      }
    };
    
    publicAxios.post.mockResolvedValue(mockResponse);
    
    renderWithProviders(<LoginPage />);
    
    // 폼 입력
    fireEvent.change(screen.getByLabelText(/이메일/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/비밀번호/i), { target: { value: 'password123' } });
    
    // 폼 제출
    fireEvent.click(screen.getByRole('button', { name: /로그인/i }));
    
    // 호출이 올바른 데이터로 이루어졌는지 확인
    await waitFor(() => {
      expect(publicAxios.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      });
    });
    
    // localStorage에 토큰과 사용자 정보가 저장되었는지 확인
    await waitFor(() => {
      expect(localStorage.getItem('accessToken')).toBe('mock-access-token');
      expect(localStorage.getItem('refreshToken')).toBe('mock-refresh-token');
      expect(localStorage.getItem('tokenExpires')).toBe('1h');
      
      const storedUser = JSON.parse(localStorage.getItem('user'));
      expect(storedUser.email).toBe('test@example.com');
    });
    
    // 홈 페이지로 리다이렉트 되었는지 확인
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
  
  it('handles login failure', async () => {
    // 로그인 실패 응답 모킹
    const mockErrorResponse = {
      success: false,
      error: {
        message: '이메일 또는 비밀번호가 올바르지 않습니다.'
      }
    };
    
    publicAxios.post.mockResolvedValue(mockErrorResponse);
    
    renderWithProviders(<LoginPage />);
    
    // 폼 입력
    fireEvent.change(screen.getByLabelText(/이메일/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/비밀번호/i), { target: { value: 'wrongpassword' } });
    
    // 폼 제출
    fireEvent.click(screen.getByRole('button', { name: /로그인/i }));
    
    // 에러 메시지 확인
    await waitFor(() => {
      expect(screen.getByText(/이메일 또는 비밀번호가 올바르지 않습니다/i)).toBeInTheDocument();
    });
  });
  
  it('handles network error', async () => {
    // 네트워크 오류 모킹
    publicAxios.post.mockRejectedValue(new Error('Network Error'));
    
    renderWithProviders(<LoginPage />);
    
    // 폼 입력
    fireEvent.change(screen.getByLabelText(/이메일/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/비밀번호/i), { target: { value: 'password123' } });
    
    // 폼 제출
    fireEvent.click(screen.getByRole('button', { name: /로그인/i }));
    
    // 에러 메시지 확인
    await waitFor(() => {
      expect(screen.getByText(/서버 연결에 실패했습니다/i)).toBeInTheDocument();
    });
  });
});