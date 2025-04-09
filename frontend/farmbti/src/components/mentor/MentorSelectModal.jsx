import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { authAxios } from '../../API/common/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// 모달 앱 요소 설정 (접근성 목적)
Modal.setAppElement('#root'); // 앱에 맞게 수정 필요

const MentorSelectModal = ({ isOpen, onClose, mentor }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      setCurrentUser(JSON.parse(userInfo));
    }
  }, []);
  
  if (!mentor) return null;

  // 채팅 생성 함수
  const handleCreateChat = async () => {
    console.log('현재 사용자:', currentUser);
    console.log('멘토 정보:', mentor);

    if (currentUser && currentUser.id === mentor.userId) {
      console.log('자신에게 질문 시도: 차단됨');
      toast.error("나 자신에게는 질문할 수 없습니다");
      return;
    }
    
    console.log('다른 멘토에게 질문: 허용됨');
    setIsLoading(true);
    
    try {
      // 채팅방 생성 API 요청
      const response = await authAxios.post('/chat/create', {
        otherId: mentor.mentorId // 멘토 ID 사용
      });
      
      console.log('채팅방 생성 응답:', response);
      
      // 응답 구조에 따라 채팅방 ID 추출 (응답 구조에 맞게 수정 필요)
      let chatRoomId;
      
      if (response.data && response.data.success && response.data.data) {
        // {success: true, data: {roomId: 123}} 형태인 경우
        chatRoomId = response.data.data.roomId || response.data.data.id;
      } else if (response.data && response.data.roomId) {
        // {roomId: 123} 형태인 경우
        chatRoomId = response.data.roomId;
      } else if (response.data && typeof response.data === 'number') {
        // 직접 룸 ID가 반환되는 경우
        chatRoomId = response.data;
      }
      
      if (chatRoomId) {
        console.log(`채팅방 ${chatRoomId}로 이동합니다`);
        onClose(); // 모달 닫기
        // 채팅 페이지로 이동하면서 룸 ID를 state로 전달
        navigate('/chat', { state: { roomId: chatRoomId, mentorName: mentor.name } });
      } else {
        console.error('채팅방 ID를 찾을 수 없습니다:', response);
        toast.error('채팅방 생성에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('채팅 생성 중 오류 발생:', error);
      toast.error('서버 연결 중 문제가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white p-6 rounded-xl shadow-md max-w-4xl w-full mx-auto relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
      contentLabel="멘토 프로필 상세 정보"
      shouldReturnFocusAfterClose={false}
      shouldCloseOnOverlayClick={false} // 백드롭 클릭으로 닫히지 않도록 설정
    >
      <div className="mentor-modal w-full">
        {/* 닫기 버튼 */}
        <div className="absolute top-4 right-4" style={{ zIndex: 10 }}>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-2xl"
            aria-label="모달 닫기"
          >
            ✕
          </button>
        </div>

        {/* 프로필 이미지 */}
        <div className="w-24 h-24 mx-auto mb-6">
          <div className="w-full h-full rounded-full overflow-hidden border-4 border-green-600">
            <img
              src={mentor.profileImage || '/default-profile.jpg'} 
              alt={`${mentor.name} 멘토 프로필`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 멘토 소개 텍스트 */}
        <div className="text-center mb-6">
          <p className="text-lg mb-2">
            안녕하세요, 저는 {mentor.farmingYears || 0}년부터 경작중인 멘토 {mentor.name || ''}입니다.
          </p>
          <p className="text-lg mb-4">
            {mentor.bio || '궁금한 거 있으면 언제든지 물어보세요!!!'}
          </p>
        </div>

        {/* 멘토링 신청 버튼 */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleCreateChat}
            disabled={isLoading}
            className={`px-8 py-3 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <span>연결 중...</span>
            ) : (
              <>
                질문하러 가기
                <span className="ml-2">▶</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MentorSelectModal;