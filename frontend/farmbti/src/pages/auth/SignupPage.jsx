import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 추가: 라우팅을 위한 import
import { toast } from 'react-toastify'; // 추가: 토스트 알림을 위한 import
import signup_image from '../../asset/auth/login.png';
import useKakaoAddressService from '../../API/useKakaoAddressService';
import { publicAxios } from '../../API/common/AxiosInstance';
import { Eye, EyeOff, Loader2 } from 'lucide-react'; 

const SignupPage = () => {
  const navigate = useNavigate(); // 추가: 페이지 이동을 위한 navigate 함수
  // 비밀번호 표시 상태 추가
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    address: ''
  });

  // 비밀번호 표시/숨김 토글 함수
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // 비밀번호 확인 표시/숨김 토글 함수
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  

  const [errors, setErrors] = useState({});
  console.log("errors = ", errors);

  // 주소가 선택되었을 때 호출될 함수
  const handleAddressSelected = (addressData) => {
    setFormData(prev => ({
      ...prev,
      address: addressData.address,
    }));
  };
  
  // 주소검색 서비스 훅 사용
  const { openAddressSearch } = useKakaoAddressService(handleAddressSelected);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Name validation function
  const isValidName = (name) => {
    if (!name || name.trim() === "") return false;
    const trimmedName = name.trim();
    
    // 길이 검증 (2~10자)
    if (trimmedName.length < 2 || trimmedName.length > 10) return false;
    
    // 특수문자가 없는지 검증 (영문, 한글, 숫자만 허용)
    const nameRegex = /^[A-Za-z가-힣0-9\s]+$/;
    return nameRegex.test(trimmedName);
    };

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation (minimum 8 characters, at least one letter and one number)
  const isValidPassword = (password) => {
    return password.length >= 8 && password.length <= 100 && /[A-Za-z]/.test(password) && /\d/.test(password);
  };

  // Date validation
  const isValidDate = (year, month, day) => {
    // Check if all date parts exist
    if (!year || !month || !day) return false;
    
    // Create date objects for comparison
    const birthDate = new Date(year, month - 1, day);
    const currentDate = new Date();
    
    // Check if birth date is valid and in the past
    return birthDate instanceof Date && 
      !isNaN(birthDate) && 
      birthDate < currentDate;
  };

  const validateForm = () => {
    const newErrors = {};

    // 이름 검증
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = '이름은 필수 입력 항목입니다.';
    } else if (formData.name.trim().length < 2 || formData.name.trim().length > 10) {
      newErrors.name = '이름은 2자 이상 10자 이하로 입력해주세요.';
    } else if (!/^[A-Za-z가-힣0-9\s]+$/.test(formData.name.trim())) {
      newErrors.name = '이름에는 특수문자를 사용할 수 없습니다.';
    }
      
    // 이메일 검증
    if (!formData.email) {
      newErrors.email = '이메일은 필수 입력 항목입니다.';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요.';
    }
    
    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = '비밀번호는 필수 입력 항목입니다.';
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = '비밀번호는 최소 8자 이상이며, 문자와 숫자를 포함해야 합니다.';
    }
    
    // 비밀번호 확인 검증
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인은 필수 입력 항목입니다.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }
    
    // 성별 검증
    if (!formData.gender) {
      newErrors.gender = '성별은 필수 선택 항목입니다.';
    }
    
    // 생년월일 검증
    if (!formData.birthYear || !formData.birthMonth || !formData.birthDay) {
      newErrors.birthDate = '생년월일은 필수 입력 항목입니다.';
    } else if (!isValidDate(formData.birthYear, formData.birthMonth, formData.birthDay)) {
      newErrors.birthDate = '유효한 생년월일을 선택해주세요.';
    }
    
    // 주소 검증
    if (!formData.address) {
      newErrors.address = '주소는 필수 입력 항목입니다.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);  // 제출 상태 추가

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 이미 제출 중이면 중복 제출 방지
    if (isSubmitting) return;
    
    // 폼 유효성 검사 실행
    const isValid = validateForm();
  
    if (isValid) {
      try {
        setIsSubmitting(true);  // 제출 시작
        
        const birthDate = new Date(
          formData.birthYear,
          formData.birthMonth - 1,
          formData.birthDay
        ).toISOString();
  
        const userData = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          address: formData.address,
          gender: formData.gender === 'male' ? "0" : "1",
          birth: birthDate
        };
        
        // API 호출
        const response = await publicAxios.post('/auth/signUp', userData);
        
        // 성공 응답 처리 
        toast.success('회원가입이 완료되었습니다! 로그인 해주세요');
        navigate('/login');
        
      } catch (error) {
        console.error('회원가입 오류:', error);
        
        // 에러 객체 확인
        if (error && error.error) {
          // 400번대 에러 처리 (비즈니스 로직 에러)
          if (error.error.type === 'BUSINESS') {
            // 특정 필드 관련 에러
            if (error.error.code === 'EMAIL_INVALID' || error.error.code === 'EMAIL_DUPLICATE') {
              setErrors(prev => ({
                ...prev,
                email: error.error.message
              }));
            } else if (error.error.code === 'PASSWORD_INVALID') {
              setErrors(prev => ({
                ...prev,
                password: error.error.message
              }));
            } else {
              // 기타 비즈니스 에러는 토스트로 표시
              toast.warning(error.error.message || '입력 정보를 확인해주세요.');
            }
          } else {
            // SYSTEM 에러나 기타 에러는 토스트로 표시
            toast.error(error.error.message || '서버 오류가 발생했습니다.');
          }
        } else {
          // 형식에 맞지 않는 에러
          toast.error('알 수 없는 오류가 발생했습니다.');
        }
      } finally {
        setIsSubmitting(false);  // 제출 완료
      }
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
          
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
             
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
                {errors.email && (<p className="mt-1 text-sm text-red-600">{errors.email}</p>)}
              </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="비밀번호를 입력해주세요"
                    maxLength={100}
                    className="block w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-500 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (<p className="mt-1 text-sm text-red-600">{errors.password}</p>)}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호 확인
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="비밀번호를 다시 입력해주세요"
                    className="block w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-500 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (<p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  이름
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  maxLength={10}
                  placeholder="이름을 입력해주세요"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {errors.name && (<p className="mt-1 text-sm text-red-600">{errors.name}</p>)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  성별
                </label>
                <div className="flex space-x-4 mt-2">
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
                {errors.gender && (<p className="mt-1 text-sm text-red-600">{errors.gender}</p>)}
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
                  data-testid="birth-year-select"
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
                  data-testid="birth-month-select"
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
                  data-testid="birth-day-select"
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
              {errors.birthDate && (<p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>)}
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                주소
              </label>
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="주소"
                  className="col-span-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  readOnly
                />
                {/* 주소검색 버튼 - 직접 Signup.jsx에 구현 */}
                <button
                  type="button"
                  onClick={openAddressSearch}
                  className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                  주소 검색
                </button>
              </div>
              {errors.address && (<p className="mt-1 text-sm text-red-600">{errors.address}</p>)}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white
                  ${isSubmitting 
                    ? 'bg-green-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'} 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    <span>처리중...</span>
                  </div>
                ) : (
                  '회원가입'
                )}
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