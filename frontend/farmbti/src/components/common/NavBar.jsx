import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify'; // 추가: toast 알림 import
import logo from "../../asset/navbar/main_logo.svg";
import userIcon from "../../asset/navbar/user_icon.svg";
import bellIcon from "../../asset/navbar/bell_icon.svg";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { authAxios } from '../../API/common/AxiosInstance';
import { MessageSquare } from 'lucide-react';

import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice'; // 로그아웃 액션 import 경로 수정

const Navbar = () => {
    const menuItemClass = "py-1 px-4 text-gray-900 hover:text-green-700";
    const location = useLocation();
    const [isInChatPage, setIsInChatPage] = useState(false);

    // Redux 스토어에서 로그인 상태 가져오기
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    
    // 로컬 스토리지에서 사용자 정보 가져오기
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        if (isLoggedIn) {
            const userDataStr = localStorage.getItem('user');
            if (userDataStr) {
                try {
                    const userData = JSON.parse(userDataStr);
                    setUser(userData);
                } catch (error) {
                    console.error('Failed to parse user data:', error);
                }
            }
        } else {
            setUser(null);
        }
    }, [isLoggedIn]);


    // location이 변경될 때마다 현재 페이지가 채팅 페이지인지 확인
    useEffect(() => {
      setIsInChatPage(location.pathname === '/chat');
      console.log("현재 페이지 위치:", location.pathname, "채팅 페이지 여부:", location.pathname === '/chat');
    }, [location]);


    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // 드롭다운 메뉴 상태 관리
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    // 알림 관련 상태 추가
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const notificationRef = useRef(null);
    const stompClient = useRef(null);

    const handleMouseLeave = () => {
      setTimeout(() => {
          setIsDropdownOpen(false);
      }, 3000);
    };
  
    const handleNotificationMouseLeave = () => {
        setTimeout(() => {
            setIsNotificationOpen(false);
        }, 3000);
    };
    
    // 드롭다운 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // WebSocket 연결 설정
    useEffect(() => {
        if (isLoggedIn && user && user.name) {
            // JWT 토큰 가져오기
            const token = localStorage.getItem('accessToken'); // 다른 페이지와 동일한 키 사용
            
            if (!token) {
                console.error("JWT 토큰이 없습니다. WebSocket 연결에 인증이 필요합니다.");
                return;
            }
            
            // WebSocket 연결
            stompClient.current = new Client({
                webSocketFactory: () => new SockJS('https://j12d209.p.ssafy.io/gs-guide-websocket'),
                connectHeaders: {
                    Authorization: `Bearer ${token}` // JWT 토큰을 연결 헤더에 추가
                },
                debug: (str) => {
                    console.log(str);
                },
                reconnectDelay: 2000,
                heartbeatIncoming: 4000, 
                heartbeatOutgoing: 4000,
                        });
    
            stompClient.current.onConnect = () => {
                console.log("웹소켓 연결 성공!");
                console.log("현재 사용자 정보:", user);
                console.log("user.name:", user.name);
                
                // 사용자별 알림 구독 (name을 사용자 식별자로 사용)
                stompClient.current.subscribe(`/user/queue/notifications`, (message) => {
                    console.log("알림메시지 수신:", message.body);
                    console.log('user.name ==,' ,user.name);
                    
                    try {
                        const receivedData = JSON.parse(message.body);
                        console.log("백엔드에서 받은 원본 메시지:", receivedData);

                        // 현재 경로를 실시간으로 다시 확인 (더 확실하게 하기 위해)
                        const currentPathname = window.location.pathname;
                        const currentlyInChatPage = currentPathname === '/chat';

                        

                        // 현재 채팅 페이지에 있는 경우 알림 표시하지 않음
                        if (currentlyInChatPage || isInChatPage) {
                          console.log("현재 채팅 페이지에 있어 알림을 표시하지 않습니다.");
                          return;
                        }


                        // 현재 localStorage에서 채팅방 ID 확인 (최신 상태 반영)
                        const currentRoomId = localStorage.getItem('currentChatRoomId');
                        
                        // 수신된 메시지의 roomId와 현재 채팅방 ID 비교
                        // 문자열과 숫자 타입을 처리하기 위해 == 연산자 사용
                        if (currentRoomId && receivedData.roomId == currentRoomId) {
                          console.log(`현재 채팅방(${currentRoomId})의 메시지 알림을 무시합니다.`);
                          return; // 알림 처리하지 않고 종료
                        }

    
                        // 백엔드 DTO 형식에 맞게 알림 객체 생성
                        const notification = {
                            id: Date.now().toString(),
                            title: "새 메시지",
                            message: `${receivedData.sender}님이 메시지를 보냈습니다.`,
                            createdAt: receivedData.timestamp,
                            read: false,
                            senderId: receivedData.sender,
                            roomId: receivedData.roomId // 서버에서 받은 roomId 저장

                        };
                        console.log("생성된 알림 객체:", notification);
                        console.log("메세지 길이=", notification.message.length)

                        
                        // 새 알림 추가 및 읽지 않은 알림 카운트 증가
                        setNotifications(prev => [notification, ...prev]);
                        setUnreadCount(prev => prev + 1);
                        
                        // 토스트 알림 표시
                        toast.info(`${receivedData.sender}님의 새 메시지가 도착했습니다.`, {
                          position: "top-right",
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          icon: <MessageSquare size={18} color="#4a9eff" />, // lucide-react 아이콘 사용
                          style: { 
                              background: "#e8f4fd", 
                              border: "1px solid #4a9eff", 
                              borderLeft: "5px solid #4a9eff" 
                          },
                          className: 'message-toast'
                      });
                      


                        
                    } catch (error) {
                        console.error('알림 처리 중 오류 발생:', error);
                        console.error('원본 메시지:', message.body);
                    }
                });
            };
    
            stompClient.current.onStompError = (frame) => {
                console.error('STOMP 에러:', frame);
            };
            
            stompClient.current.onWebSocketError = (error) => {
                console.error('WebSocket 에러:', error);
            };
    
            stompClient.current.activate();
    
            // 컴포넌트 언마운트 시 WebSocket 연결 해제
            return () => {
                if (stompClient.current && stompClient.current.connected) {
                    stompClient.current.deactivate();
                }
            };
        }
    }, [isLoggedIn, user]);    



    // 초기 알림 데이터 로드
    useEffect(() => {
        if (isLoggedIn) {
            // 알림을 DB에 저장하지 않으므로 초기 상태는 빈 배열
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [isLoggedIn]);



    
    
    // 알림 읽음 // 알림 읽음 처리 함수 (로컬에서만 처리)
const markAsRead = (notificationId) => {
    // 알림 상태 업데이트
    setNotifications(prev => 
        prev.map(notif => 
            notif.id === notificationId ? { ...notif, read: true } : notif
        )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
};



    // 모든 알림 읽음 처리 (로컬에서만 처리)
    const markAllAsRead = () => {
    // 모든 알림을 읽음 상태로 변경하는 대신 알림함 비우기
    setNotifications([]);
    setUnreadCount(0);
    
    // 토스트 알림으로 알림함을 비웠다는 메시지 표시 (선택사항)
    toast.info('모든 알림을 처리했습니다.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
    });
  
  
  };



// 로그아웃 핸들러
const handleLogout = async (e) => {
  e.preventDefault();
  
  try {
      // 백엔드 서버에 로그아웃 요청 보내기
      const response = await authAxios.post('/auth/logout');
      
      // 성공 응답인지 확인
      if (response.success) {
          // WebSocket 연결 해제
          if (stompClient.current && stompClient.current.connected) {
              stompClient.current.deactivate();
          }
          
          // 로컬 스토리지에서 토큰 제거
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("tokenExpires");
          localStorage.removeItem("user");
          
          // 리덕스 스토어에서 로그아웃 액션 디스패치
          dispatch(logout());
          setIsDropdownOpen(false);
          
          toast.success('로그아웃 성공!', {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true
          });
          
          navigate('/');
      } else {
          // 성공이 아닌 경우 오류 메시지 표시
          throw new Error(response.error?.message || '로그아웃 실패');
      }
  } catch (error) {
      console.error('로그아웃 실패:', error);
      
      // 오류가 발생해도 로컬에서는 로그아웃 처리
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenExpires");
      localStorage.removeItem("user");
      
      dispatch(logout());
      
      toast.error('로그아웃 중 오류가 발생했습니다', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
      });
      
      navigate('/');
  }
};

return (
      <nav className="bg-white border-gray-200 relative z-[100]">
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
                  작물 수익 계산기
                </Link>
              </li>
              <li>
                <Link to="/mentors" className={menuItemClass}>
                  귀농 멘토 찾기
                </Link>
              </li>
              <li>
                <Link to="/news" className={menuItemClass}>
                  귀농 뉴스
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex items-center">
            <div className="relative" 
            ref={dropdownRef}
            onMouseLeave={handleMouseLeave}
            >
              <button
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onMouseEnter={() => setIsDropdownOpen(true)}
              >
                <img src={userIcon} alt="사용자" className="h-6 w-6" />
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
                    onClick={handleLogout}
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
                    to="/signup"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    회원가입
                  </Link>
                </div>
              )}
            </div>

            {/* 알림 버튼 및 드롭다운 - 로그인 상태일 때만 표시 */}
            {isLoggedIn && (
              <div className="relative" 
              ref={notificationRef}
              onMouseLeave={handleNotificationMouseLeave}
              onMouseEnter={() => setIsNotificationOpen(true)}

              >
                <button
                  className={`p-2 ${unreadCount > 0 ? 'bg-red-100' : 'hover:bg-gray-100'} rounded-full relative`}
                  onClick={() => {
                      setIsNotificationOpen(!isNotificationOpen);
                  }}
                >
                  <img src={bellIcon} alt="알림" className="h-6 w-6" />
                  {/* 읽지 않은 알림 표시 */}
                  {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/3 -translate-y-1/3 bg-red-500 rounded-full">
                      {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
              )}
                </button>

                {/* 알림 드롭다운 */}
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-[100] border border-gray-200 max-h-96 overflow-y-auto">
                    <div className="flex items-center justify-between px-4 py-2 border-b">
                      <h3 className="text-sm font-medium">알림</h3>
                      {notifications.length > 0 && (
                        <button
                          className="text-xs text-blue-500 hover:text-blue-700"
                          onClick={markAllAsRead}
                        >
                          모두 읽음 표시
                        </button>
                      )}
                    </div>

                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-gray-500">
                        알림이 없습니다.
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 border-b hover:bg-gray-50 cursor-pointer ${
                            !notification.read ? "bg-blue-50" : ""
                          }`}
                          onClick={() => {
                            // 읽음 처리
                            if (!notification.read) {
                              markAsRead(notification.id);
                            }

                          // roomId가 있는 경우 해당 채팅방으로 이동
                          if (notification.roomId) {
                            console.log(`알림 클릭: 채팅방 ${notification.roomId}으로 이동합니다.`);
                            navigate('/chat', { 
                              state: { 
                                roomId: notification.roomId,
                                mentorName: notification.senderId, // sender를 mentorName으로 사용
                                refreshChatRooms: true // 새로운 플래그 추가

                              } 
                            });
                          } else {
                            // roomId가 없는 경우 기본 채팅 페이지로 이동
                            console.log('채팅방 ID가 없어 기본 채팅 페이지로 이동합니다.');
                            navigate('/chat', {
                              state: {
                                refreshChatRooms: true // 새로운 플래그 추가
                              }
                            });
                        

                          }
                          setIsNotificationOpen(false);


                          }}
                        >
                          <div className="flex">
                            <div className="ml-3 w-full">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(notification.createdAt).toLocaleString(
                                  "ko-KR",
                                  {
                                    year: "numeric",
                                    month: "numeric",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </p>
                            </div>
                            {!notification.read && (
                              <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    );
};

export default Navbar;