// 서버에서 받은, UTC 기준 타임스탬프를 KST로 변환
const convertUTCtoKST = (utcTimestamp) => {
  try {
    if (!utcTimestamp) return formatTime(new Date());
    
    // UTC 시간을 Date 객체로 변환
    const utcDate = new Date(utcTimestamp);
    
    // 유효한 날짜인지 확인
    if (isNaN(utcDate.getTime())) {
      console.warn('유효하지 않은 UTC 날짜:', utcTimestamp);
      return formatTime(new Date());
    }
    
    // UTC 시간에 9시간(한국 시간대) 추가
    const kstDate = new Date(utcDate.getTime() + (9 * 60 * 60 * 1000));
    
    console.log('원본 UTC 시간:', utcDate.toISOString());
    console.log('변환된 KST 시간:', kstDate.toISOString());
    
    // KST 시간을 형식에 맞게 포맷팅하여 반환
    return new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(kstDate);
  } catch (error) {
    console.error('UTC→KST 변환 오류:', error);
    return formatTime(new Date());
  }
};import React, { useState, useEffect, useRef } from 'react';
import { authAxios } from '../../API/common/AxiosInstance';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useLocation, useNavigate } from 'react-router-dom';

const Chat = () => {
const location = useLocation();
const navigate = useNavigate();

const [message, setMessage] = useState('');
const [messages, setMessages] = useState([]);
const [currentTime, setCurrentTime] = useState('');
const [connected, setConnected] = useState(false);
const [roomId, setRoomId] = useState(null);
const [chatRooms, setChatRooms] = useState([]);
const stompClient = useRef(null);
const messagesEndRef = useRef(null); // 메시지 영역의 끝 참조
const chatContainerRef = useRef(null); // 채팅 컨테이너 참조 추가
const [currentUser, setCurrentUser] = useState('');
const messageIdCounter = useRef(0);
const MAX_CHAR_LIMIT = 1000;
const textareaRef = useRef(null);

// 뒤로가기 함수
const handleGoBack = () => {
  navigate(-1);
};

// 불필요한 Navbar 알람 필터링 용용
useEffect(() => {
  if (roomId) {
    console.log(`현재 채팅방을 ${roomId}로 설정합니다.`);
    localStorage.setItem('currentChatRoomId', roomId);
  }
  
  // 컴포넌트 언마운트 시 현재 채팅방 초기화
  return () => {
    console.log(`채팅방에서 나갑니다.`);
    localStorage.removeItem('currentChatRoomId');
  };
}, [roomId]);

// URL state에서 roomId 가져오기
useEffect(() => {
  if (location.state && location.state.roomId) {
    console.log(`URL state에서 채팅방 ID ${location.state.roomId} 로드`);
    setRoomId(location.state.roomId);
  }
}, [location]);

// 사용자 정보 가져오기
useEffect(() => {
  const userInfo = localStorage.getItem('user');
  if (userInfo) {
    try {
      const parsedUser = JSON.parse(userInfo);
      console.log('현재 사용자 정보:', parsedUser);
      setCurrentUser(parsedUser);
    } catch (error) {
      console.error('사용자 정보 파싱 오류:', error);
    }
  }
}, []);

// 채팅방 목록 로드 (컴포넌트 마운트시 1회만 실행)
useEffect(() => {
  const fetchChatRooms = async () => {
    try {
      const response = await authAxios.get('/chat/get/rooms');
      console.log('채팅방 목록 응답:', response);
      
      if (Array.isArray(response.data)) {
        setChatRooms(response.data);
      } else if (response.data && response.data.success) {
        setChatRooms(response.data.data);
      }
    } catch (error) {
      console.error('채팅방 목록 조회 실패:', error);
    }
  };

  fetchChatRooms();
}, []);

/* 텍스트 영역 자동 높이 조절을 위한 함수 */
const adjustTextareaHeight = (element) => {
if (!element) return;

// 기존 높이 초기화
element.style.height = 'auto';

// 스크롤 높이 기반으로 새 높이 계산 (최대 높이 제한)
const newHeight = Math.min(element.scrollHeight, 120);

// 새 높이 적용
element.style.height = `${newHeight}px`;

};

/* 컴포넌트에 useEffect 추가 */
useEffect(() => {
// 메시지 상태가 변경될 때마다 높이 자동 조절
if (textareaRef.current) {
  adjustTextareaHeight(textareaRef.current);
}
}, [message]);



const handleMessageChange = (e) => {
let input = e.target.value;

// 연속된 특수문자 사이에 숨겨진 공백 추가 (선택적)
// 예: ",,,,," -> ", , , , ,"
// 정규식은 실제 필요에 맞게 조정
if (input.match(/([,;.!?]){5,}/g)) {
  input = input.replace(/([,;.!?])([,;.!?])/g, '$1\u200B$2');
}

if (input.length <= MAX_CHAR_LIMIT) {
  setMessage(input);
  
  // 타이머로 높이 조정
  setTimeout(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, 0);
}
};

// 메시지 목록 가져오기 함수
const fetchMessages = async (chatRoomId) => {
  if (!chatRoomId) {
    console.log('채팅방 ID가 없어 메시지를 로드하지 않습니다.');
    return;
  }
  
  try {
    // 메시지 목록 초기화
    setMessages([]);
    
    console.log(`채팅방 ${chatRoomId}의 메시지를 가져오는 중...`);
    const response = await authAxios.get(`/chat/${chatRoomId}/messages/detail`);
    
    console.log(`채팅방 ${chatRoomId} 메시지 응답:`, response.data);
    
    // 현재 사용자 정보 가져오기 - 문자열 ID를 숫자로 변환
    const userInfo = localStorage.getItem('user');
    let currentUserId = null;
    
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      // 문자열인 경우 숫자로 변환 (백엔드가 숫자 ID를 사용할 경우)
      currentUserId = typeof parsedUser.id === 'string' ? parseInt(parsedUser.id, 10) : parsedUser.id;
    }
    
    console.log('현재 사용자 ID (변환 후):', currentUserId, '타입:', typeof currentUserId);
    
    // 응답 형식 구조 처리
    let messageData = [];
    
    if (Array.isArray(response.data)) {
      messageData = response.data;
    } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
      messageData = response.data.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      messageData = response.data.data;
    } else {
      console.warn(`채팅방 ${chatRoomId} 메시지 응답 형식을 처리할 수 없음:`, response.data);
      return;
    }
    
    // 메시지 형식을 컴포넌트에 맞게 변환
    const fetchedMessages = messageData.map((msg) => {
      // senderId를 적절한 타입으로 변환
      const msgSenderId = typeof msg.senderId === 'string' ? parseInt(msg.senderId, 10) : msg.senderId;
      
      // 상세 로깅: ID 타입과 값 비교
      console.log(`메시지 ID ${msg.messageId} - 송신자 ID: ${msgSenderId} (${typeof msgSenderId}), 현재 사용자 ID: ${currentUserId} (${typeof currentUserId})`);
      console.log(`ID 일치 여부: ${msgSenderId === currentUserId}`);
      
      // 타입까지 고려한 ID 비교
      const isMe = msgSenderId === currentUserId;
      
      // 시간 정보 처리 (UTC → KST 변환)
      const timeField = msg.sentAt || msg.sendTime || msg.timestamp;
      const messageTime = timeField ? convertUTCtoKST(timeField) : formatTime(new Date());
      
      return {
        id: `msg-${msg.messageId || Date.now() + Math.random()}`,
        text: msg.content,
        time: messageTime, // UTC->KST 변환된 시간 사용
        isMe: isMe,
        roomId: chatRoomId
      };
    });
    
    console.log(`채팅방 ${chatRoomId}에서 ${fetchedMessages.length}개의 메시지를 로드 완료`);
    
    // 디버깅: 각 메시지의 isMe 속성 확인
    fetchedMessages.forEach(msg => {
      console.log(`메시지 '${msg.text}' - isMe: ${msg.isMe}, 시간: ${msg.time}`);
    });
    
    // 상태 업데이트
    setMessages(fetchedMessages);
    
    // 메시지가 로드된 후 스크롤을 맨 아래로 이동 (setTimeout으로 상태 업데이트 후 실행)
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  } catch (error) {
    console.error(`채팅방 ${chatRoomId}의 메시지 조회 실패:`, error);
  }
};

// 채팅방 ID 변경시 해당 채팅방의 메시지 조회
useEffect(() => {
  if (roomId) {
    console.log(`채팅방 ${roomId}로 전환, 메시지 로드 시작`);
    
    // 채팅방 변경 시 웹소켓 재연결 및 메시지 로드
    fetchMessages(roomId);
    connectWebSocket();
  }
}, [roomId]);

// 메시지가 추가되거나 변경될 때마다 스크롤을 맨 아래로 이동
useEffect(() => {
  scrollToBottom();
}, [messages]);

// 맨 아래로 스크롤하는 함수
const scrollToBottom = () => {
  if (chatContainerRef.current) {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }
};

// connectWebSocket 함수 수정 - 구독 관리 개선
const connectWebSocket = () => {
  if (!roomId) {
    console.log('채팅방 ID가 없어 웹소켓을 연결하지 않습니다.');
    return;
  }
  
  // 기존 연결 해제
  disconnectWebSocket();

  // 새 STOMP 클라이언트 생성
  const client = new Client({
    webSocketFactory: () => new SockJS('https://j12d209.p.ssafy.io/gs-guide-websocket'),
    connectHeaders: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    },
    debug: function (str) {
      console.log('STOMP: ' + str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,

    onConnect: () => {
      console.log(`채팅방 ${roomId}에 웹소켓 연결 완료`);
      setConnected(true);
      
      // 현재 채팅방만 구독
      const subscription = client.subscribe(`/topic/chat/${roomId}`, (payload) => {
        onMessageReceived(payload, roomId);
      });
      
      // 구독 정보 저장
      client.currentSubscription = subscription;
      client.currentRoomId = roomId;
    },
    onStompError: (frame) => {
      console.error('STOMP 에러:', frame);
    }
  });

  client.activate();
  stompClient.current = client;
};

// 웹소켓 연결 해제 함수 수정 - 구독 해제 로직 강화
const disconnectWebSocket = () => {
  if (stompClient.current) {
    // 이전 구독이 있으면 해제
    if (stompClient.current.currentSubscription) {
      try {
        stompClient.current.currentSubscription.unsubscribe();
        console.log(`채팅방 ${stompClient.current.currentRoomId} 구독 해제`);
      } catch (error) {
        console.error('구독 해제 오류:', error);
      }
    }
    
    // 연결 해제
    if (stompClient.current.connected) {
      stompClient.current.deactivate();
      console.log('STOMP 클라이언트 연결 해제');
    }
    
    setConnected(false);
  }
};

// 메시지 수신 처리
const onMessageReceived = (payload, currentRoomId) => {
  try {
    const receivedMessage = JSON.parse(payload.body);
    console.log('새 메시지 수신:', receivedMessage);
    
    // 현재 사용자 정보 가져오기
    const userInfo = localStorage.getItem('user');
    const currentUserId = userInfo ? JSON.parse(userInfo).id : null;
    
    // 메시지에 roomId가 있고 현재 채팅방과 다르면 무시
    const messageRoomId = receivedMessage.roomId || receivedMessage.chatRoomId;
    if (messageRoomId && messageRoomId !== currentRoomId) {
      console.log(`다른 채팅방 메시지(${messageRoomId}), 현재 채팅방(${currentRoomId})에서 무시`);
      return;
    }
    
    // 자신이 보낸 메시지인지 확인 (이미 UI에 추가되었으므로 무시)
    if (receivedMessage.senderId === currentUserId) {
      console.log('자신이 보낸 메시지, 무시');
      return;
    }

    // 서버에서 받은 시간 처리
    // timestamp 또는 sentAt 필드 확인 (상대 서버 구현에 맞춤)
    const messageTimestamp = receivedMessage.timestamp || receivedMessage.sentAt || new Date().toISOString();
    console.log('수신된 원본 타임스탬프(UTC):', messageTimestamp);
    
    // UTC에서 KST로 변환 (한국 시간으로 +9시간)
    const kstTime = convertUTCtoKST(messageTimestamp);
    console.log('변환된 KST 시간:', kstTime);
    
    // 상대방 메시지 추가
    const newMessage = {
      id: `server-${receivedMessage.messageId || Date.now()}`,
      text: receivedMessage.content || receivedMessage.message, // 메시지 필드명 대응
      time: kstTime, // 변환된 KST 시간 사용
      isMe: false,
      roomId: currentRoomId
    };
    
    console.log('처리된 메시지:', newMessage);
    
    // 메시지 목록에 추가
    setMessages(prev => [...prev, newMessage]);

    // 채팅방 목록에서 현재 채팅방의 lastMessage 업데이트
    updateChatRoomLastMessage(currentRoomId, messageContent);

    
    // 새 메시지가 추가되면 자동으로 맨 아래로 스크롤 (useEffect에서 처리)
  } catch (error) {
    console.error('메시지 처리 오류:', error);
  }
};

// 채팅방 목록 업데이트 함수 추가
const updateChatRoomLastMessage = (roomId, lastMessage) => {
  setChatRooms(prevRooms => {
    return prevRooms.map(room => {
      if (room.roomId === roomId) {
        return { ...room, lastMessage };
      }
      return room;
    });
  });
};




// 시간 형식 변환 함수 - UTC를 KST로 변환하여 표시
const formatTime = (dateInput) => {
  // ISO 문자열, 날짜 객체, 또는 Unix 타임스탬프를 처리
  let dateObj;
  
  try {
    // 문자열인지 확인
    if (typeof dateInput === 'string') {
      // 서버로부터 온 UTC 시간 처리
      if (dateInput.includes('T')) {
        console.log('서버 시간 포맷 감지:', dateInput);
        dateObj = new Date(dateInput);
      } else {
        dateObj = new Date(dateInput);
      }
    } 
    // 숫자(타임스탬프)인지 확인
    else if (typeof dateInput === 'number') {
      dateObj = new Date(dateInput);
    }
    // 이미 Date 객체인 경우
    else if (dateInput instanceof Date) {
      dateObj = dateInput;
    }
    // 기타 경우 현재 시간 사용
    else {
      console.warn('알 수 없는 시간 형식, 현재 시간 사용:', dateInput);
      dateObj = new Date();
    }
    
    // 유효한 날짜인지 확인
    if (isNaN(dateObj.getTime())) {
      console.warn('유효하지 않은 날짜:', dateInput);
      dateObj = new Date(); // 유효하지 않은 경우 현재 시간 사용
    }
    
    // 디버깅을 위한 로그 추가
    console.log('변환 전 시간(UTC 가정):', dateObj.toISOString());
    
    // 한국 시간대로 변환하여 반환
    const kstTime = new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Seoul'
    }).format(dateObj);
    
    console.log('변환 후 시간(KST):', kstTime);
    return kstTime;
  } catch (error) {
    console.error('시간 변환 오류:', error);
    // 오류 발생 시 현재 시간 반환
    return new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Seoul'
    }).format(new Date());
  }
};
      
// KST(한국 시간)을 ISO 문자열로 반환하되, 시간대 오프셋 정보를 포함시킴
const getKSTISOString = () => {
  const now = new Date();
  
  // 한국 시간대 오프셋 (UTC+9)을 직접 계산
  const koreaOffsetHours = 9;
  
  // 현재 UTC 시간에서 9시간 더한 날짜 객체 생성 (KST)
  const koreaTime = new Date(now.getTime() + (koreaOffsetHours * 60 * 60 * 1000));
  
  // ISO 문자열로 변환하되 Z(UTC) 대신 +09:00(KST) 오프셋 사용
  const isoString = koreaTime.toISOString().replace('Z', '+09:00');
  
  // 로깅을 통한 확인
  console.log('현재 로컬 시간(KST):', new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Seoul'
  }).format(now));
  
  console.log('서버에 보낼 ISO 시간(KST):', isoString);
  
  return isoString;
};

// 메시지 전송 처리 함수
const handleSendMessage = () => {
  if (message.trim() && connected && roomId) {
    // 현재 한국 시간으로 타임스탬프 생성 (KST 오프셋 포함)
    const now = new Date();
    const kstTimeString = getKSTISOString();
    
    // 로컬 스토리지에서 사용자 정보 가져오기
    const userInfo = JSON.parse(localStorage.getItem('user'));
    
    console.log("백엔드에 보내고있는 senderId==", userInfo.id);
    console.log("현재 시간(KST, 오프셋 포함):", kstTimeString);
    
    // 웹소켓으로 메시지 전송 - 두 필드 모두 전송하여 호환성 확보
    stompClient.current.publish({
      destination: `/chat/${roomId}/send`,
      body: JSON.stringify({ 
        message: message.trim(),
        senderName: userInfo.name,
        senderId: userInfo.id,      // 사용자 ID 명시적으로 추가
        sentAt: kstTimeString,      // KST ISO 문자열(+09:00 포함)
        timestamp: kstTimeString,   // 대체 필드로도 전송
        kstOffset: '+09:00'         // 명시적 KST 오프셋 정보 추가
      })
    });
    
    // UI에 메시지 추가
    const newMessage = {
      id: `client-${Date.now()}`,
      text: message,
      time: formatTime(now),
      isMe: true // 내가 보낸 메시지
    };
     
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setMessage('');

    // 채팅방 목록에서 현재 채팅방의 lastMessage 업데이트
    updateChatRoomLastMessage(roomId, message.trim());

    
    // 메시지 전송 후 스크롤 맨 아래로 이동 (useEffect에서 처리)
  }
};

// 엔터키 처리
const handleKeyPress = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSendMessage();
  }
};

// 멘토 이름 가져오기
const getMentorName = () => {
  if (location.state && location.state.mentorName) {
    return location.state.mentorName;
  }
  
  // state에 없으면 채팅방 목록에서 찾기
  const currentRoom = chatRooms.find(room => room.roomId === roomId);
  return currentRoom ? currentRoom.otherUserName : "멘토";
};

return (
  <div className="flex h-screen bg-gray-100">
    {/* 좌측 멘토 목록 */}
    <div className="w-1/4 bg-white border-r flex flex-col">
      {/* 뒤로가기 버튼 - 헤더와 높이 맞춤 */}
      <div className="p-4 border-b flex items-center h-16">
        <button 
          className="text-gray-600 hover:text-gray-900 p-2"
          onClick={handleGoBack}
        >
          ←
        </button>
      </div>
      
      {/* 대화 중인 멘토 목록 */}
      <div className="p-4 flex-1 overflow-y-auto">
        <h3 className="text-lg font-bold mb-3">대화 중인 멘토 목록</h3>
        <div className="space-y-4">
          {chatRooms.length > 0 ? (
            chatRooms.map((room) => (
              <div 
                key={room.roomId} 
                className={`flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer ${room.roomId === roomId ? 'bg-green-100' : ''}`}
                onClick={() => setRoomId(room.roomId)}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
                    <img 
                    src={room.otherUserProfile && room.otherUserProfile.startsWith('http') 
                      ? room.otherUserProfile 
                      : `/api/placeholder/48/48`} 
                    alt={room.otherUserName} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="font-bold truncate">{room.otherUserName}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {room.lastMessage 
                        ? (room.lastMessage.length > 20 
                          ? room.lastMessage.substring(0, 20) + '...' 
                          : room.lastMessage)
                        : "대화를 시작합니다"}
                    </p>
                  </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">대화 중인 멘토가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
    
    
    {/* 우측 채팅 영역 */}
    <div className="w-3/4 flex flex-col">
      {roomId ? (
        <>
          {/* 헤더 - 좌측 뒤로가기 버튼과 높이 맞춤 */}
          <div className="bg-white p-4 flex items-center justify-between border-b h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <img 
                        src={(() => {
                          // 현재 선택된 채팅방 찾기
                          const currentRoom = chatRooms.find(room => room.roomId === roomId);
                          // 좌측 목록과 동일한 방식으로 이미지 표시
                          return (currentRoom && currentRoom.otherUserProfile && 
                                currentRoom.otherUserProfile.startsWith('http')) 
                                ? currentRoom.otherUserProfile 
                                : `/api/placeholder/40/40`;
                        })()} 
                        alt={getMentorName()} 
                        className="w-full h-full object-cover" 
                      />

                </div>
              <div>
                <h2 className="font-bold">{getMentorName()}</h2>
              </div>
            </div>
            <button className="text-gray-600">
              ⋮
            </button>
          </div>

          {/* 채팅 메시지 영역 - chatContainerRef 추가 */}
          <div className="flex-1 p-4 overflow-y-auto" ref={chatContainerRef}>
            <div className="space-y-4">
              <div className="text-center text-gray-500 text-sm">
                {new Date().toLocaleDateString('ko-KR', {year: 'numeric', month: 'long', day: 'numeric'})}
              </div>
              
                {/* 메시지들 */}
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className="flex items-end mb-4">
                        {/* 내 메시지일 경우 시간이 왼쪽에 표시됨 */}
                        {msg.isMe && (
                          <span className="text-xs text-gray-500 mr-2 mb-1.5">
                            {msg.time}
                          </span>
                        )}
                        
                        {/* 메시지 버블 */}
                        <div className={`max-w-xs md:max-w-md ${msg.isMe ? 'bg-green-500 text-white rounded-2xl rounded-tr-sm' : 'bg-gray-300 rounded-2xl rounded-tl-sm'} px-4 py-2`}>
                          <p className="whitespace-pre-line">{msg.text}</p>
                        </div>
                        
                        {/* 상대방 메시지일 경우 시간이 오른쪽에 표시됨 */}
                        {!msg.isMe && (
                          <span className="text-xs text-gray-500 ml-2 mb-1.5">
                            {msg.time}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 my-8">
                    <p>멘토에게 질문을 시작해보세요!</p>
                  </div>
                )}
              
              {/* 메시지 끝 참조 지점 */}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* 메시지 입력 영역 */}
          <div className="bg-white p-4 border-t">
            <div className="flex items-center">
              <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                className="w-full border rounded-lg py-2 px-4 pr-12 resize-none"
                placeholder="메시지를 입력해주세요. (최대 1000자)"
                rows={1}
                style={{ 
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                  overflowWrap: 'anywhere',
                  minHeight: '40px',
                  maxHeight: '120px',
                  overflow: 'auto',
                  lineHeight: '1.5',
                  display: 'block',
                  width: '100%'
                }}
                value={message}
                onChange={handleMessageChange}
                onKeyPress={handleKeyPress}
              />
                <span className="absolute right-3 bottom-2 text-gray-400 text-sm">
                  {message.length}/{MAX_CHAR_LIMIT}
                </span>
              </div>
              <button 
                className={`ml-2 p-2 rounded-full ${message.trim() ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}
                onClick={handleSendMessage}
                disabled={!message.trim() || !connected}
              >
                전송
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <p className="text-xl text-gray-500 mb-4">좌측에서 대화할 멘토를 선택하거나</p>
            <p className="text-xl text-gray-500">멘토 프로필에서 '질문하러 가기'를 클릭하세요.</p>
          </div>
        </div>
      )}
    </div>
  </div>
);
};

export default Chat;