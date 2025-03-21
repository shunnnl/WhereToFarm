import React, { useState, useEffect } from 'react';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentTime, setCurrentTime] = useState('');

  // 시간 형식 설정
  useEffect(() => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setCurrentTime(`${hours}:${minutes}`);
  }, []);

  // 초기 메시지 설정
  useEffect(() => {
    setMessages([
      {
        id: 1,
        sender: '윤석열',
        text: '안녕하세요.편하게 말 걸어주세요^^',
        time: '오후 12:38',
        isMe: false
      }
    ]);
  }, []);

  // 메시지 전송 처리
  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        time: currentTime,
        isMe: true
      };
      setMessages([...messages, newMessage]);
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
            {/* 멘토 1 */}
            <div className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                <img src="/api/placeholder/48/48" alt="멘토1" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold">멘토1</p>
                <p className="text-sm text-gray-500">연락주세요</p>
              </div>
            </div>

            
            {/* 멘토 3 */}
            <div className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                <img src="/api/placeholder/48/48" alt="멘토2" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold">멘토2</p>
                <p className="text-sm text-gray-500">연락주세요</p>
              </div>
            </div>
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
              <h2 className="font-bold">멘토1</h2>
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