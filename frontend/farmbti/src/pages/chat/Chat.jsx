import React, { useState, useEffect, useRef } from 'react';
import { authAxios } from '../../API/common/AxiosInstance';
import { Client } from '@stomp/stompjs'; // STOMP 클라이언트 임포트
import SockJS from 'sockjs-client';

const Chat = () => {
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentTime, setCurrentTime] = useState('');
  const [connected, setConnected] = useState(false);
  const [roomId, setRoomId] = useState(1); // 기본 채팅방 ID
  const [chatRooms, setChatRooms] = useState([]); // 대화 중인 멘토 목록
  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);
  const [currentUser, setCurrentUser]  = useState('');
  const messageIdCounter = useRef(0);

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
  
  // 채팅방 ID 변경시 해당 채팅방의 메시지 조회
  useEffect(() => {
    if (roomId) {
      fetchMessages(roomId);
    }
  }, [roomId]);

  // 메시지 목록 가져오기
  const fetchMessages = async (roomId) => {
    try {
      const response = await authAxios.get(`/chat/${roomId}/messages/detail`);
      if (response.data && response.data.success) {
        setMessages(response.data.data.map((msg, index) => ({
          id: index + 1,
          text: msg.content,
          time: formatTime(new Date(msg.sendTime)),
          isMe: msg.senderId === currentUser?.id
        })));
      }
    } catch (error) {
      console.error('메시지 조회 실패:', error);
    }
  };

  // 웹소켓 연결
  useEffect(() => {
    if (roomId && currentUser) {
      connectWebSocket();
    }
    return () => {
      disconnectWebSocket();
    };
  }, [roomId, currentUser]);

// 웹소켓 연결 함수 수정
const connectWebSocket = () => {
  disconnectWebSocket(); // 기존 연결 해제

  const client = new Client({
    // brokerURL 대신 webSocketFactory 사용
    webSocketFactory: () => new SockJS('http://j12d209.p.ssafy.io/gs-guide-websocket'),
    connectHeaders: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    },
    debug: function (str) {
      console.log('STOMP: ' + str);
    },
    reconnectDelay: 5000,
    onConnect: () => {
      console.log('웹소켓 연결 성공');
      setConnected(true);
      
      // 채팅방 구독
      client.subscribe(`/topic/chat/${roomId}`, onMessageReceived);
    },
    onStompError: (frame) => {
      console.error('STOMP 에러:', frame);
    }
  });

  client.activate();
  stompClient.current = client;
};

  // 웹소켓 연결 해제
  const disconnectWebSocket = () => {
    if (stompClient.current && stompClient.current.connected) {
      stompClient.current.deactivate();
      setConnected(false);
    }
  };

  // 메시지 수신 처리
// 1. // onMessageReceived 함수 수정
// 메시지 수신 처리 함수 - senderId로 구분
const onMessageReceived = (payload) => {
  const receivedMessage = JSON.parse(payload.body);
  console.log('수신된 메시지 전체:', receivedMessage);
  
  // 로컬 스토리지에서 사용자 정보 가져오기
  const userInfo = JSON.parse(localStorage.getItem('user'));
  console.log('현재 사용자 ID:', userInfo.id);
  console.log('메시지 송신자 ID:', receivedMessage.senderId);
  
  // 자신이 보낸 메시지인지 확인 (senderId와 현재 사용자 ID 비교)
  if (receivedMessage.senderId === userInfo.id) {
    console.log('자신이 보낸 메시지, 무시함');
    return; // 이미 UI에 추가된 메시지이므로 무시
  }
  
  // 상대방 메시지 추가
  const newMessage = {
    id: `server-${receivedMessage.messageId}`,
    text: receivedMessage.content,
    time: formatTime(new Date(receivedMessage.sentAt)),
    isMe: false // 상대방 메시지
  };
  
  setMessages(prev => [...prev, newMessage]);
};




  // 채팅방 목록 가져오기
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await authAxios.get('/chat/get/rooms');
        console.log('응답 구조:', response);
        // 응답이 배열인 경우와 {success, data} 형식인 경우 모두 처리
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

  // 시간 형식 변환 함수
  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  
// 2. 메시지 전송 처리 함수 수정
const handleSendMessage = () => {
  if (message.trim() && connected && roomId) {
    const now = new Date();
    
    // 로컬 스토리지에서 사용자 정보 가져오기
    const userInfo = JSON.parse(localStorage.getItem('user'));
    
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
                  className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => setRoomId(room.roomId)}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                    <img 
                      src={room.otherUserProfile.startsWith('http') 
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
        {/* 헤더 - 좌측 뒤로가기 버튼과 높이 맞춤 */}
        <div className="bg-white p-4 flex items-center justify-between border-b h-16">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
              <img src="/api/placeholder/40/40" alt="프로필" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="font-bold">
                {chatRooms.find(room => room.roomId === roomId)?.otherUserName || "멘토"}
              </h2>
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
              2025년 01월 27일
            </div>
            
            {/* 메시지들 */}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md relative ${msg.isMe ? 'bg-green-500 text-white rounded-2xl rounded-tr-sm' : 'bg-gray-300 rounded-2xl rounded-tl-sm'} px-4 py-2`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className={`text-xs absolute bottom-1 ${msg.isMe ? 'left-0 -ml-16 text-gray-500' : 'right-0 -mr-16 text-gray-500'}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
            
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
              disabled={!message.trim()}
            >
              전송
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;