// MentorRegistrationModal.jsx
import React from 'react';
import Modal from 'react-modal';
import { useState, useEffect } from 'react';
import { publicAxios, authAxios } from '../../API/common/AxiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice'; 
import { toast } from 'react-toastify'; // Toast 알림 import 추가

const MentorRegistrationModal  = ({ isOpen, onRequestClose }) => {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector(state => state.auth);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [description, setDescription] = useState('');
  const [formData, setFormData] = useState({
    Year: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [isCheckingMentorStatus, setIsCheckingMentorStatus] = useState(false);
  const [isAlreadyMentor, setIsAlreadyMentor] = useState(false);
  const [mentorData, setMentorData] = useState(null);
  const resetForm = () => {
    setSelectedFoods([]);
    setDescription('');
    setFormData({ Year: '' });
    setSubmitResult(null);
  };

  const topFood = [
    { 
      id: "사과", 
      label: "사과", 
      iconSrc: "https://farmbticropbuckets.s3.ap-northeast-2.amazonaws.com/apple.png" 
    },
    {
      id: "오이",
      label: "오이",
      iconSrc: "https://farmbticropbuckets.s3.ap-northeast-2.amazonaws.com/cucumber.png",
    },
    { 
      id: "포도", 
      label: "포도", 
      iconSrc: "https://farmbticropbuckets.s3.ap-northeast-2.amazonaws.com/grape.png" 
    },
    { 
      id: "대파", 
      label: "대파", 
      iconSrc: "https://farmbticropbuckets.s3.ap-northeast-2.amazonaws.com/greenonion.png" 
    },
    {
      id: "상추",
      label: "상추",
      iconSrc: "https://farmbticropbuckets.s3.ap-northeast-2.amazonaws.com/lettuce.png",
    },
    { 
      id: "양파", 
      label: "양파", 
      iconSrc: "https://farmbticropbuckets.s3.ap-northeast-2.amazonaws.com/onion.png" 
    },
    { 
      id: "배", 
      label: "배", 
      iconSrc: "https://farmbticropbuckets.s3.ap-northeast-2.amazonaws.com/pear.png" 
    },
    {
      id: "고구마",
      label: "고구마",
      iconSrc: "https://farmbticropbuckets.s3.ap-northeast-2.amazonaws.com/sweetpotato.png",
    },
    { 
      id: "감귤", 
      label: "감귤", 
      iconSrc: "https://farmbticropbuckets.s3.ap-northeast-2.amazonaws.com/tangerine.png" 
    },
    {
      id: "수박",
      label: "수박",
      iconSrc: "https://farmbticropbuckets.s3.ap-northeast-2.amazonaws.com/watermelon.png",
    },
  ];

  const handleClose = () => {
    resetForm();
    onRequestClose();
  };

  //모달 닫을때 폼 초기화
  useEffect(() => {
    if (isOpen) {
      if (isLoggedIn) {
        checkUserStatus();
      }
      resetForm(); // 모달이 열릴 때마다 폼 초기화
    }
  }, [isOpen, isLoggedIn]);




    // 사용자 정보 및 멘토 상태 확인
    const checkUserStatus = async () => {
      if (!isLoggedIn) return;
      
      try {
        setIsCheckingMentorStatus(true);
        // 사용자 정보를 가져오는 API 호출
        const response = await authAxios.get('/users/me');
        
        // API 응답 구조에 맞게 확인
        if (response.data && response.data.success && response.data.data) {
          const userData = response.data.data;
          
          // isMentor 필드로 멘토 여부 확인
          if (userData.isMentor) {
            console.log('이미 멘토로 등록되어 있습니다:', userData);
            setIsAlreadyMentor(true);
            setMentorData({
              bio: userData.bio || '',
              farmingYears: userData.farmingYears || 0,
              cropNames: userData.cropNames || []
            });
            setSubmitResult({ 
              success: false, 
              message: '이미 멘토로 등록되어 있습니다.' 
            });
          } else {
            setIsAlreadyMentor(false);
            setMentorData(null);
          }
        }
      } catch (error) {
        console.error('사용자 정보 확인 중 오류 발생:', error);
        
        // 인증 오류인 경우 로그아웃 처리
        if (error.response && error.response.status === 401) {
          console.error('인증 오류 - 로그아웃 처리');
          dispatch(logout());
          setSubmitResult({ 
            success: false, 
            message: '세션이 만료되었습니다. 다시 로그인해주세요.' 
          });
        }
      } finally {
        setIsCheckingMentorStatus(false);
      }
    };
  
    // 모달이 열릴 때마다 사용자 정보 확인
    useEffect(() => {
      if (isOpen && isLoggedIn) {
        checkUserStatus();
      }
    }, [isOpen, isLoggedIn]);
  

  // Redux 로그인 상태 및 토큰 확인
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    
    console.log("Redux 로그인 상태:", isLoggedIn);
    console.log("토큰 존재 여부:", {
      accessToken: !!accessToken,
      refreshToken: !!refreshToken
    });
    
    // Redux 상태와 localStorage 토큰 일치 여부 확인
    if (!isLoggedIn && (accessToken || refreshToken)) {
      console.warn("토큰은 존재하지만 Redux에는 로그인되어 있지 않음");
    }
  }, [isLoggedIn]);

  const toggleFood = (id) => {
    if (selectedFoods.includes(id)) {
      setSelectedFoods(selectedFoods.filter(type => type !== id));
    } else {
      setSelectedFoods([...selectedFoods, id]);
    }
  };

  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    if (text.length <= 100) {
      setDescription(text);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    
    setFormData(updatedFormData);
    console.log("formData 업데이트됨:", updatedFormData);
  };

  // 유효성 검사 함수 (Toast 알림 포함)
  const validateForm = () => {
    // 귀농 연도 체크
    if (!formData.Year) {
      toast.error('귀농 연도를 선택해주세요.');
      return false;
    }
    
    // 재배 작물 선택 체크
    if (selectedFoods.length === 0) {
      toast.error('하나 이상의 재배 작물을 선택해주세요.');
      return false;
    }
    
    if (!description.trim() || description.trim().length < 10) {
      toast.error('멘토 소개는 10자 이상 입력해주세요.');
      isValid = false;
    }
      
    return true;
  };

  // 멘토 등록 데이터 제출 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 제출 기본 동작 방지 추가
    
    // 폼 유효성 검사
    if (!validateForm()) {
      return;
    }
    
    try {
      console.log("제출 시작:", { formData, selectedFoods, description });

      // 로그인 상태 및 토큰 확인
      if (!isLoggedIn) {
        console.error("Redux 상태: 로그인되어 있지 않음");
        toast.error('로그인이 필요합니다.');
        setSubmitResult({ 
          success: false, 
          message: '로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?' 
        });
        return;
      }
      
      // accessToken, refreshToken 확인
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      
      if (!accessToken && !refreshToken) {
        console.error("토큰이 존재하지 않음");
        toast.error('로그인 정보가 유효하지 않습니다.');
        setSubmitResult({ 
          success: false, 
          message: '로그인 정보가 유효하지 않습니다. 다시 로그인해주세요.' 
        });
        return;
      }

      setIsSubmitting(true);
      
      // 전송할 데이터 구성
      const mentorData = {
        bio: description,
        farmingYears: parseInt(formData.Year),
        cropNames: selectedFoods
      };
      
      console.log("전송할 데이터:", mentorData);
      
      // 헤더 확인 로그 추가
      console.log("요청 헤더:", {
        'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
        'Content-Type': 'application/json'
      });
      
      // POST 요청 보내기 - authAxios 인스턴스 사용
      const response = await authAxios.post('/mentors', mentorData);
      
      console.log('멘토 등록 성공:', response);
      toast.success('멘토 등록이 성공적으로 완료되었습니다.');
      onRequestClose(); // setTimeout 제거하고 바로 닫기
      
      // 성공 시 폼 초기화
      setFormData({ Year: '' });
      setSelectedFoods([]);
      setDescription('');
      
      
    } catch (error) {
      console.error('멘토 등록 실패:', error);
      
      // 에러 응답 상세 로깅
      if (error.response) {
        console.error('에러 상태:', error.response.status);
        console.error('에러 데이터:', error.response.data);
        console.error('에러 헤더:', error.response.headers);
      } else if (error.request) {
        console.error('요청은 보냈으나 응답을 받지 못함:', error.request);
      } else {
        console.error('요청 설정 중 오류 발생:', error.message);
      }
      
      // 토큰 관련 에러인지 확인
      if (error.response && error.response.status === 401) {
        console.error('인증 오류 - 로그아웃 처리');
        dispatch(logout()); // 로그아웃 액션 디스패치
        toast.error('세션이 만료되었습니다. 다시 로그인해주세요.');
        setSubmitResult({ 
          success: false, 
          message: '세션이 만료되었습니다. 다시 로그인해주세요.' 
        });
      } else {
        // 서버에서 온 오류 메시지를 그대로 사용
        const serverErrorMessage = error.response?.data?.error?.message;
        
        if (serverErrorMessage) {
          toast.error(serverErrorMessage);
          setSubmitResult({ 
            success: false, 
            message: serverErrorMessage
          });
        } else {
          const fallbackErrorMessage = error.message || '알 수 없는 오류';
          toast.error(fallbackErrorMessage);
          setSubmitResult({ 
            success: false, 
            message: fallbackErrorMessage
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 연도 옵션 생성 (현재 연도부터 100년 전까지)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: 100 }, 
    (_, i) => currentYear - i
  );

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="bg-white p-6 rounded-xl shadow-md max-w-4xl w-full mx-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
    >
      <form onSubmit={handleSubmit} className="w-full">
        <div className='mb-4 text-center w-full'>
          <h2 className="text-2xl font-bold mb-2">멘토 등록</h2>
          <p className="text-gray-600 text-sm">성공적인 자신의 귀농 스토리를 들려주고 싶지 않나요?</p>
          <p className="text-gray-600 text-sm">멘토로 등록한 후, 멘티들과 많은 이야기를 나누어보세요!</p>
        </div>

        <div className="space-y-3">
          {/* 연도선택 */}
          <div className='flex items-center space-x-4'>
            <h3 className="text-lg font-bold">귀농 연도</h3>
            <div className="w-80">
              <select
                name="Year"
                value={formData.Year}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">연도 선택</option>
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 재배 작물 선택 */}
          <div className="flex items-start space-x-4">
            <h3 className="text-lg font-bold whitespace-nowrap mt-2">재배 작물</h3>
            <div className="flex flex-wrap justify-center">
              {topFood.map((food) => (
                <div key={food.id} className="w-1/5 p-1 flex flex-col items-center">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      id={food.id}
                      name="foodType"
                      checked={selectedFoods.includes(food.id)}
                      onChange={() => toggleFood(food.id)}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
                    />
                    <label 
                      htmlFor={food.id}
                      className="cursor-pointer pl-6"
                    >
                      <div className="w-14 h-14 bg-green-700 rounded-full flex items-center justify-center text-white">
                        <img src={food.iconSrc} alt={food.label} className="w-14 h-14 rounded-full" />
                      </div>
                    </label>
                  </div>
                  <span className="mt-1 text-xs">{food.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 멘토 소개 */}
          <div className="flex items-start space-x-4">
            <h3 className="text-lg font-bold whitespace-nowrap mt-2">멘토 소개</h3>
            <div className="flex flex-col w-full">
              <textarea
                id="description"
                value={description}
                onChange={handleDescriptionChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-green-500
                focus:border-transparent resize-none"
                placeholder="10자 이상 100자 이내로 멘토 소개를 입력해주세요"
                rows={4}
              />
              <div className="w-full text-right text-sm text-gray-500">
                {description.length}/100
              </div>
            </div>
          </div>
        </div>

        {/* 에러/성공 메시지 표시 */}
        {submitResult && (
          <div className={`${submitResult.success ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'} px-4 py-2 rounded mt-3 mb-2 border`}>
            {submitResult.message}
          </div>
        )}

        <div className="flex justify-center gap-4 mt-4">
          <button
            type="button"
            className="bg-gray-100 text-black py-2 px-4 rounded"
            onClick={handleClose}   
          >
            닫기
          </button>

          <button 
            type="submit"
            className={`${isSubmitting ? 'bg-green-600' : 'bg-green-800 hover:bg-green-700'} text-white py-2 px-4 rounded transition-colors flex items-center justify-center`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                처리 중...
              </>
            ) : "등록"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MentorRegistrationModal;