import React, { useState, useEffect, useRef } from 'react';
import { authAxios } from '../../API/common/AxiosInstance';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useLocation } from 'react-router-dom';

const Chat = () => {
  const location = useLocation();
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentTime, setCurrentTime] = useState('');
  const [connected, setConnected] = useState(false);
  // roomId를 null로 초기화하고 navigate로 전달된 state에서 값을 가져옵니다
  const [roomId, setRoomId] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);
  const [currentUser, setCurrentUser] = useState('');
  const messageIdCounter = useRef(0);

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
        
        return {
          id: `msg-${msg.messageId || Date.now() + Math.random()}`,
          text: msg.content,
          time: formatTime(new Date(msg.sentAt || msg.sendTime || new Date())),
          isMe: isMe,
          roomId: chatRoomId
        };
      });
      
      console.log(`채팅방 ${chatRoomId}에서 ${fetchedMessages.length}개의 메시지를 로드 완료`);
      
      // 디버깅: 각 메시지의 isMe 속성 확인
      fetchedMessages.forEach(msg => {
        console.log(`메시지 '${msg.text}' - isMe: ${msg.isMe}`);
      });
      
      // 상태 업데이트
      setMessages(fetchedMessages);
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
      webSocketFactory: () => new SockJS('wss://j12d209.p.ssafy.io/gs-guide-websocket'),
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
      
      // 상대방 메시지 추가
      const newMessage = {
        id: `server-${receivedMessage.messageId || Date.now()}`,
        text: receivedMessage.content,
        time: formatTime(new Date(receivedMessage.sentAt || new Date())),
        isMe: false, // 상대방 메시지이므로 항상 false
        roomId: currentRoomId
      };
      
      // 메시지 목록에 추가
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('메시지 처리 오류:', error);
    }
  };

  // 시간 형식 변환 함수
  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  
  // 메시지 전송 처리 함수
  const handleSendMessage = () => {
    if (message.trim() && connected && roomId) {
      const now = new Date();
      
      // 로컬 스토리지에서 사용자 정보 가져오기
      const userInfo = JSON.parse(localStorage.getItem('user'));
      
      console.log("백엔드에 보내고있는 senderId==", userInfo.id)
      // 웹소켓으로 메시지 전송
      stompClient.current.publish({
        destination: `/chat/${roomId}/send`,
        body: JSON.stringify({ 
          message: message.trim(),
          senderName: userInfo.name,
          senderId: userInfo.id  // 사용자 ID 명시적으로 추가
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
          <button className="text-gray-600">
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
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                    <img 
                      src={room.otherUserProfile && room.otherUserProfile.startsWith('http') 
                        ? room.otherUserProfile 
                        : `/api/placeholder/48/48`} 
                      alt={room.otherUserName} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <p className="font-bold">{room.otherUserName}</p>
                    <p className="text-sm text-gray-500">
                      {room.lastMessage || "연락주세요"}
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
                  <img src="/api/placeholder/40/40" alt="프로필" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="font-bold">{getMentorName()}</h2>
                </div>
              </div>
              <button className="text-gray-600">
                ⋮
              </button>
            </div>

            {/* 채팅 메시지 영역 */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <div className="text-center text-gray-500 text-sm">
                  {new Date().toLocaleDateString('ko-KR', {year: 'numeric', month: 'long', day: 'numeric'})}
                </div>
                
                {/* 메시지들 */}
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs md:max-w-md relative ${msg.isMe ? 'bg-green-500 text-white rounded-2xl rounded-tr-sm' : 'bg-gray-300 rounded-2xl rounded-tl-sm'} px-4 py-2`}>
                        <p className="whitespace-pre-line">{msg.text}</p>
                        <span className={`text-xs absolute bottom-1 ${msg.isMe ? 'left-0 -ml-16 text-gray-500' : 'right-0 -mr-16 text-gray-500'}`}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 my-8">
                    <p>멘토에게 질문을 시작해보세요!</p>
                  </div>
                )}
                
              </div>
            </div>

            {/* 메시지 입력 영역 */}
            <div className="bg-white p-4 border-t">
              <div className="flex items-center">
                <div className="flex-1 relative">
                  <textarea
                    className="w-full border rounded-full py-2 px-4 pr-12 resize-none"
                    placeholder="메시지를 입력해주세요."
                    rows={1}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <span className="absolute right-3 bottom-2 text-gray-400 text-sm">
                    {message.length}/100
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