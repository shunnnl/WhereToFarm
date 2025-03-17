import React, { useState } from 'react';
import signup_image from '../../asset/auth/login.svg';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    adress: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 회원가입 로직 구현 (예: API 호출)
    console.log('Signup attempt with:', formData);
    
    // 패스워드 일치 확인 등 추가 검증 로직
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
  };

  // 연도 옵션 생성 (현재 연도부터 100년 전까지)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: 100 }, 
    (_, i) => currentYear - i
  );

  // 월 옵션
  const monthOptions = Array.from(
    { length: 12 }, 
    (_, i) => i + 1
  );

  // 일 옵션 (선택된 월에 따라 동적으로 변경 가능)
  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const dayOptions = formData.birthYear && formData.birthMonth
    ? Array.from(
        { length: getDaysInMonth(formData.birthYear, formData.birthMonth) }, 
        (_, i) => i + 1
      )
    : Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="flex h-screen">
      {/* 좌측 이미지 섹션 */}
      <div 
        className="w-1/2 bg-cover bg-center bg-no-repeat rounded-tr-2xl rounded-br-2xl" 
        style={{
          backgroundImage: `url(${signup_image})`,
          backgroundSize: 'cover'
        }}
      >
      </div>

      {/* 우측 회원가입 섹션 */}
      <div className="w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Signup</h2>
          <p className="text-gray-500 mb-8">어디가농의 회원이 되어보세요</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
             
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="이메일을 입력해주세요"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="비밀번호를 입력해주세요"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="비밀번호를 다시 입력해주세요"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                성별
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleChange}
                    className="form-radio h-5 w-5 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2">남성</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleChange}
                    className="form-radio h-5 w-5 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2">여성</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                생년월일
              </label>
              <div className="grid grid-cols-3 gap-4">
                <select
                  name="birthYear"
                  value={formData.birthYear}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">연도</option>
                  {yearOptions.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <select
                  name="birthMonth"
                  value={formData.birthMonth}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">월</option>
                  {monthOptions.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <select
                  name="birthDay"
                  value={formData.birthDay}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">일</option>
                  {dayOptions.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="adress" className="block text-sm font-medium text-gray-700 mb-2">
                주소
              </label>
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  name="adress"
                  value={formData.adress}
                  onChange={handleChange}
                  required
                  placeholder="주소"
                  className="col-span-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                회원가입
              </button>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">
                이미 계정이 있으신가요? {' '}
                <a href="/login" className="font-medium text-green-600 hover:text-green-500">
                  로그인
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;