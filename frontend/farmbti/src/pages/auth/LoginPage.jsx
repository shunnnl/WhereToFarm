import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify'; // 추가: 토스트 알림 import
import login_image from '../../asset/auth/login.svg'
import { Link, useNavigate } from 'react-router-dom'; 
import { publicAxios } from '../../API/common/AxiosInstance'
import { useEffect } from 'react';
import { login } from '../../store/slices/authSlice';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    server: ''
  });
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Redux dispatch 추가

  console.log("errors = ", errors)
  // 이메일 유효성 검사
  const validateEmail = (email) => {
    // 이메일 정규표현식
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // 이전 오류 초기화
    const newErrors = {
      email: '',
      password: '',
      server: ''

    };

    // 이메일 유효성 검사
    if (!email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!validateEmail(email)) {
      newErrors.email = '유효한 이메일 형식이 아닙니다.';
    }

    // 비밀번호 유효성 검사
    if (!password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }

    // 오류가 있으면 상태 업데이트 및 제출 방지
    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      return;
    }

    // 유효성 검사 통과 시 로그인 시도
    console.log('로그인 시도:', { email, password });
    
    try {
      const response = await publicAxios.post('/auth/login', {
        email,
        password
      });
      
      console.log('서버 응답:', response);
      
      // 응답 확인 - Axios가 이미 응답을 파싱했거나 인터셉터가 적용된 것 같습니다
      if (response.success) {
        // 로그인 성공 로직
        localStorage.setItem('accessToken', response.data.token.accessToken);
        localStorage.setItem('refreshToken', response.data.token.refreshToken);
        localStorage.setItem('tokenExpires', response.data.token.accessTokenExpiresInForHour);
        
        const userData = {
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
          address: response.data.address,
          gender: response.data.gender,
          profileImage: response.data.profileImage
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        dispatch(login(userData));
        
        toast.success('로그인 성공!', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
        
        navigate('/');
      } else {
        // 로그인 실패 로직
        const errorMessage = response.error?.message || '로그인에 실패했습니다. 다시 시도해주세요.';
        newErrors.server = errorMessage;
        setErrors(newErrors);
      }
    } catch (error) {
      console.error('로그인 실패 (네트워크 오류):', error);
      newErrors.server = '서버 연결에 실패했습니다. 다시 시도해주세요.';
      setErrors(newErrors);
    }
    
  };

  return (
    <div className="w-full h-screen flex">
      {/* 좌측 이미지 섹션 */}
      <div className="w-1/2 bg-cover bg-center bg-no-repeat rounded-tr-2xl rounded-br-2xl"
        style={{
          backgroundImage: `url(${login_image})`,
          backgroundSize: 'cover'
        }}>
      </div>

      {/* 우측 로그인 섹션 */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Login</h2>
          <p className="text-gray-500 mb-8">로그인 후 다양한 서비스를 이용하세요</p>
          <form onSubmit={handleLogin} noValidate className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="이메일을 입력해주세요"
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {errors.email && (<p className="mt-1 text-sm text-red-600">{errors.email}</p>)}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="비밀번호를 입력해주세요"
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {errors.password && (<p className="mt-1 text-sm text-red-600">{errors.password}</p>)}
              {errors.server && (<p className="mt-1 text-sm text-red-600">{errors.server}</p>)}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  로그인 상태 유지
                </label>
              </div>
              <div>
                <a href="#" className="text-sm text-green-600 hover:text-green-500">
                  비밀번호를 잊으셨나요?
                </a>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                로그인
              </button>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">
                계정이 없으신가요? {' '}
                <Link to="/signup" className="font-medium text-green-600 hover:text-green-500">
                  회원가입
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;