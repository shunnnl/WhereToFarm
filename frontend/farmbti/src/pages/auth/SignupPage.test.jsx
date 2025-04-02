import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SignupPage from './SignupPage';
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

// 카카오 주소 서비스 모킹
vi.mock('../../API/useKakaoAddressService', () => ({
  default: () => ({
    openAddressSearch: vi.fn().mockImplementation(() => {
      // 주소 검색 후 콜백 시뮬레이션
      return Promise.resolve({ address: '서울특별시 강남구 테헤란로' });
    })
  })
}));

// 테스트 래퍼 컴포넌트
const renderSignupPage = () => {
  return render(
    <BrowserRouter>
      <SignupPage />
    </BrowserRouter>
  );
};

describe('SignupPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // localStorage 모킹 초기화 (필요한 경우)
    localStorage.clear();
  });
  
  it('renders the signup form correctly', () => {
    renderSignupPage();
    
    // 폼 요소들이 렌더링 되었는지 확인
    expect(screen.getByLabelText(/이메일/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/비밀번호$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/비밀번호 확인/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/이름/i)).toBeInTheDocument();
    expect(screen.getByText(/성별/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/남성/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/여성/i)).toBeInTheDocument();
    expect(screen.getByText(/생년월일/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/주소/i)).toBeInTheDocument(); // label을 통해 주소 필드 확인
    expect(screen.getByRole('button', { name: /주소 검색/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /회원가입/i })).toBeInTheDocument();
    expect(screen.getByText(/이미 계정이 있으신가요/i)).toBeInTheDocument();
  });
  
  it('validates the form fields correctly', async () => {
    renderSignupPage();
    
    // 비어있는 폼 제출 시도
    fireEvent.click(screen.getByRole('button', { name: /회원가입/i }));
    
    // 필수 필드 에러 메시지 확인
    await waitFor(() => {
      expect(screen.getByText(/이름은 필수 입력 항목입니다/i)).toBeInTheDocument();
      expect(screen.getByText(/이메일은 필수 입력 항목입니다/i)).toBeInTheDocument();
      expect(screen.getByText(/비밀번호는 필수 입력 항목입니다/i)).toBeInTheDocument();
      expect(screen.getByText(/비밀번호 확인은 필수 입력 항목입니다/i)).toBeInTheDocument();
      expect(screen.getByText(/성별은 필수 선택 항목입니다/i)).toBeInTheDocument();
      expect(screen.getByText(/생년월일은 필수 입력 항목입니다/i)).toBeInTheDocument();
      expect(screen.getByText(/주소는 필수 입력 항목입니다/i)).toBeInTheDocument();
    });
  });
  
  it('validates email format correctly', async () => {
    renderSignupPage();
    
    // 잘못된 이메일 형식 입력
    fireEvent.change(screen.getByLabelText(/이메일/i), {
      target: { value: 'invalid-email' }
    });
    
    // 폼 제출
    fireEvent.click(screen.getByRole('button', { name: /회원가입/i }));
    
    // 이메일 형식 오류 메시지 확인
    await waitFor(() => {
      expect(screen.getByText(/유효한 이메일 주소를 입력해주세요/i)).toBeInTheDocument();
    });
  });
  
  it('validates password strength correctly', async () => {
    renderSignupPage();
    
    // 짧은 비밀번호 입력
    fireEvent.change(screen.getByLabelText(/비밀번호$/i), {
      target: { value: 'weak' }
    });
    
    // 폼 제출
    fireEvent.click(screen.getByRole('button', { name: /회원가입/i }));
    
    // 비밀번호 강도 오류 메시지 확인
    await waitFor(() => {
      expect(screen.getByText(/비밀번호는 최소 8자 이상이며, 문자와 숫자를 포함해야 합니다/i)).toBeInTheDocument();
    });
  });
  
  it('validates password confirmation correctly', async () => {
    renderSignupPage();
    
    // 서로 다른 비밀번호 입력
    fireEvent.change(screen.getByLabelText(/비밀번호$/i), {
      target: { value: 'Password123' }
    });
    
    fireEvent.change(screen.getByLabelText(/비밀번호 확인/i), {
      target: { value: 'DifferentPassword123' }
    });
    
    // 폼 제출
    fireEvent.click(screen.getByRole('button', { name: /회원가입/i }));
    
    // 비밀번호 불일치 오류 메시지 확인
    await waitFor(() => {
      expect(screen.getByText(/비밀번호가 일치하지 않습니다/i)).toBeInTheDocument();
    });
  });
  
  it('handles successful signup correctly', async () => {
    // 회원가입 성공 응답 모킹
    const mockResponse = {
      success: true,
      data: {
        id: 1,
        email: 'test@example.com',
        name: '홍길동'
      }
    };
    
    publicAxios.post.mockResolvedValue(mockResponse);
    
    renderSignupPage();
    
    // 유효한 폼 데이터 입력
    fireEvent.change(screen.getByLabelText(/이메일/i), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/비밀번호$/i), {
      target: { value: 'Password123' }
    });
    
    fireEvent.change(screen.getByLabelText(/비밀번호 확인/i), {
      target: { value: 'Password123' }
    });
    
    fireEvent.change(screen.getByLabelText(/이름/i), {
      target: { value: '홍길동' }
    });
    
    // 성별 선택
    fireEvent.click(screen.getByLabelText(/남성/i));
    
    // 생년월일 선택
    const yearSelect = screen.getByTestId('birth-year-select');
    const monthSelect = screen.getByTestId('birth-month-select');
    const daySelect = screen.getByTestId('birth-day-select');
                
    fireEvent.change(yearSelect, { target: { value: '1990' } });
    fireEvent.change(monthSelect, { target: { value: '1' } });
    fireEvent.change(daySelect, { target: { value: '1' } });
    
    // 주소 버튼 클릭 및 주소 설정 (모킹된 함수에 의해 처리됨)
    fireEvent.click(screen.getByRole('button', { name: /주소 검색/i }));
    
    // 주소가 설정되었다고 가정
    fireEvent.change(screen.getByPlaceholderText(/주소/i), {
      target: { value: '서울특별시 강남구 테헤란로' }
    });
    
    // 폼 제출
    fireEvent.click(screen.getByRole('button', { name: /회원가입/i }));
    
    // API 호출 확인
    await waitFor(() => {
      expect(publicAxios.post).toHaveBeenCalledWith('/auth/signUp', expect.objectContaining({
        email: 'test@example.com',
        password: 'Password123',
        name: '홍길동',
        gender: "0" // 남성은 "0"으로 변환
      }));
    });
    
    // 홈페이지로 리다이렉트 확인
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
  
  it('handles email already exists error correctly', async () => {
    // 이메일 중복 에러 응답 모킹
    const mockErrorResponse = {
      success: false,
      error: {
        code: "EMAIL_INVALID",
        message: "이미 사용 중인 이메일입니다."
      }
    };
    
    publicAxios.post.mockResolvedValue(mockErrorResponse);
    
    renderSignupPage();
    
    // 모든 필수 필드 입력
    fireEvent.change(screen.getByLabelText(/이메일/i), {
      target: { value: 'existing@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/비밀번호$/i), {
      target: { value: 'Password123' }
    });
    
    fireEvent.change(screen.getByLabelText(/비밀번호 확인/i), {
      target: { value: 'Password123' }
    });
    
    fireEvent.change(screen.getByLabelText(/이름/i), {
      target: { value: '홍길동' }
    });
    
    // 성별 선택
    fireEvent.click(screen.getByLabelText(/남성/i));
    
    // 생년월일 선택
    const yearSelect = screen.getByRole('combobox', { name: '' });
    const monthSelect = screen.getAllByRole('combobox', { name: '' })[1];
    const daySelect = screen.getAllByRole('combobox', { name: '' })[2];
    
    fireEvent.change(yearSelect, { target: { value: '1990' } });
    fireEvent.change(monthSelect, { target: { value: '1' } });
    fireEvent.change(daySelect, { target: { value: '1' } });
    
    // 주소 설정
    fireEvent.change(screen.getByPlaceholderText(/주소/i), {
      target: { value: '서울특별시 강남구 테헤란로' }
    });
    
    // 폼 제출
    fireEvent.click(screen.getByRole('button', { name: /회원가입/i }));
    
    // 이메일 중복 에러 메시지 확인
    await waitFor(() => {
      expect(screen.getByText(/이미 사용 중인 이메일입니다/i)).toBeInTheDocument();
    });
  });
  
  it('handles server error correctly', async () => {
    // 서버 에러 시뮬레이션
    publicAxios.post.mockRejectedValue(new Error('Network Error'));
    
    renderSignupPage();
    
    // 모든 필수 필드 입력
    fireEvent.change(screen.getByLabelText(/이메일/i), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/비밀번호$/i), {
      target: { value: 'Password123' }
    });
    
    fireEvent.change(screen.getByLabelText(/비밀번호 확인/i), {
      target: { value: 'Password123' }
    });
    
    fireEvent.change(screen.getByLabelText(/이름/i), {
      target: { value: '홍길동' }
    });
    
    // 성별 선택
    fireEvent.click(screen.getByLabelText(/남성/i));
    
    // 생년월일 선택
    const yearSelect = screen.getByRole('combobox', { name: '' });
    const monthSelect = screen.getAllByRole('combobox', { name: '' })[1];
    const daySelect = screen.getAllByRole('combobox', { name: '' })[2];
    
    fireEvent.change(yearSelect, { target: { value: '1990' } });
    fireEvent.change(monthSelect, { target: { value: '1' } });
    fireEvent.change(daySelect, { target: { value: '1' } });
    
    // 주소 설정
    fireEvent.change(screen.getByPlaceholderText(/주소/i), {
      target: { value: '서울특별시 강남구 테헤란로' }
    });
    
    // 폼 제출
    fireEvent.click(screen.getByRole('button', { name: /회원가입/i }));
    
    // 토스트 에러 메시지 호출 확인
    await waitFor(() => {
      expect(vi.mocked(require('react-toastify').toast.error)).toHaveBeenCalledWith(
        '서버 연결 오류가 발생했습니다. 다시 시도해주세요.'
      );
    });
  });
});