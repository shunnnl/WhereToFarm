import React, { useState } from 'react';
import login_image from '../../asset/auth/login.svg'
import { Link } from 'react-router-dom'; 

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // 로그인 로직 구현 (예: API 호출)
    console.log('Login attempt with:', { email, password });
  };

  return (
    <div className="flex h-screen">
      {/* 좌측 이미지 섹션 */}
      <div className="w-1/2 bg-cover bg-center bg-no-repeat rounded-tr-2xl rounded-br-2xl" 
 
      style={{
        backgroundImage: `url(${login_image})`,
        backgroundSize: 'cover'
    }}>
      </div>

      {/* 우측 로그인 섹션 */}
      {/* 우측 로그인 섹션 */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Login</h2>
          <p className="text-gray-500 mb-8">로그인 후 다양한 서비스를 이용하세요</p>
          <form onSubmit={handleLogin} className="space-y-6">
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