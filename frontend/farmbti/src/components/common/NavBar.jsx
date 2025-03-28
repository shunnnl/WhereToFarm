import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // 추가: toast 알림 import
import logo from "../../asset/navbar/main_logo.svg";
import userIcon from "../../asset/navbar/user_icon.svg";
import bellIcon from "../../asset/navbar/bell_icon.svg";

import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice'; // 로그아웃 액션 import 경로 수정

const Navbar = () => {
    const menuItemClass = "py-1 px-4 text-gray-900 hover:text-green-700 dark:text-white dark:hover:text-blue-500";
    
    // Redux 스토어에서 로그인 상태 가져오기
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const dispatch = useDispatch(); // dispatch 추가
    const navigate = useNavigate(); // 페이지 이동을 위한 훅 추가
    
    // 드롭다운 메뉴 상태 관리
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    // 드롭다운 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // 로그아웃 핸들러 추가
    const handleLogout = (e) => {
        e.preventDefault();
        
        dispatch(logout()); // 로그아웃 액션 디스패치 (localStorage 정리 포함)
        setIsDropdownOpen(false);
        
        // 로그아웃 성공 토스트 메시지 표시
        toast.success('로그아웃 성공!', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
        
        navigate('/'); // 홈페이지로 리다이렉트
    };
    

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900 relative z-[100]">
            <div className="max-w-screen-2xl flex items-center justify-between mx-auto px-24 py-4">
                <div className="flex items-center ml-0">
                    <Link to="/">
                        <img
                            src={logo}
                            alt="어디가농 로고"
                            className="h-14 self-center cursor-pointer"
                        />
                    </Link>
                </div>
                
                <div className="w-auto flex-grow flex justify-center">
                    <ul className="font-medium flex flex-row space-x-8 rtl:space-x-reverse text-base">
                        <li>
                            <Link to="/surveyintro" className={menuItemClass}>
                                지역 추천 받기
                            </Link>
                        </li>
                        <li>
                            <Link to="/crop-calculator" className={menuItemClass}>
                                작물 수확 계산기
                            </Link>
                        </li>
                        <li><a href="#" className={menuItemClass}>귀농 매물 보기</a></li>
                        <li><a href="#" className={menuItemClass}>멘토 찾기</a></li>
                        <li><a href="#" className={menuItemClass}>귀농 뉴스</a></li>
                    </ul>
                </div>
                
                <div className="flex items-center">
                    <div className="relative" ref={dropdownRef}>
                        <button
                            className="p-2 hover:bg-gray-100 rounded-full"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            onMouseEnter={() => setIsDropdownOpen(true)}
                        >
                            <img
                                src={userIcon}
                                alt="사용자"
                                className="h-6 w-6"
                            />
                        </button>
                        
                        {/* 드롭다운 메뉴 */}
                        {isLoggedIn && isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-[100] border border-gray-200">
                                <Link 
                                    to="/mypage" 
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    마이페이지
                                </Link>
                                <a 
                                    href="#" 
                                    className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                                    onClick={handleLogout} // 로그아웃 핸들러 연결
                                >
                                    로그아웃
                                </a>
                            </div>
                        )}
                        
                        {/* 비로그인 상태일 때는 로그인 페이지로 이동 */}
                        {!isLoggedIn && isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-[100] border border-gray-200">
                                <Link 
                                    to="/login" 
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    로그인
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    회원가입
                                </Link>
                            </div>
                        )}
                    </div>
                    
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <img
                            src={bellIcon}
                            alt="알림"
                            className="h-6 w-6"
                        />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;