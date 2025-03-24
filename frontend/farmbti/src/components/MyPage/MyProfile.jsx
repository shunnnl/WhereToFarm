import { useRef, useState } from "react";
import leaveIcon from "../../asset/mypage/leaves.svg";
import { Camera, MessageSquare, User, Settings, Lock } from "lucide-react";
import MyPageModal from "./MyPageModal";
import MentorSettingForm from "./MentorSettingContent";
import { useSearchParams } from "react-router";

const MyProfile = ({ myInfo }) => {
  const modalRef = useRef(null);
  const [modalType, setModalType] = useState("")
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState("");

  const handleChatting = () => {
    // chat 페이지로 넘어가기
    return;
  };

  const handleMetorSetting = () => {
    setModalType("mentor")
    setModalContent(<MentorSettingForm />);
    setModalTitle("멘토 정보 수정");
    modalRef.current?.openModal();
    return;
  };

  const handleMyInfoSetting = () => {
    setModalType("user-info");
    return;
  };

  const handleMyPasswordSetting = () => {
    setModalType("password")
    return;
  };

  // 폼 제출 처리 함수 추가
  const handleConfirm = () => {
    // 여기서 API 호출 등의 폼 제출 로직 처리
    console.log("변경사항 저장");
    // 모달의 타입에 따라 다른 처리 로직 구현 가능
    if (modalType === "mentor") {
      // 멘토 정보 수정 API 호출
    } else if (modalType === "user-info") {
      // 회원 정보 수정 API 호출
    } else if (modalType === "password") {
      // 비밀번호 수정 API 호출
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center pt-10">
        <div className="profile-image">
          <div className="relative mb-2">
            <div className="w-32 h-32 rounded-full bg-background flex items-center justify-center overflow-hidden border-4 border-accentGreen">
              <img
                src="/api/placeholder/200/200"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 bg-primaryGreen text-white p-1 rounded-full w-10 h-10">
              <Camera size={32} strokeWidth={0.75} />
            </button>
          </div>
        </div>
        <div className="mentor-menti-button my-2">
          {myInfo.isMentor ? (
            <div className="px-4 py-1 bg-primaryGreen text-textColor-white rounded-full text-sm w-16 text-center">
              멘토
            </div>
          ) : (
            <div className="px-4 py-1 bg-accentGreen text-primaryGreen rounded-full text-sm w-16 text-center">
              멘티
            </div>
          )}
        </div>
      </div>
      <div className="greeting mx-10 p-2 border-b-2 border-b-gray-300 flex">
        <div>
          <span className="text-2xl text-textColor-black font-medium">
            {myInfo.userName}{" "}
          </span>
          <span className="text-lg text-textColor-black">님,</span>
          <p className="text-xl text-textColor-black">오늘도 안녕하세요 :)</p>
        </div>
        <div>
          <img src={leaveIcon} alt="잎사귀" className="w-16" />
        </div>
      </div>
      <div className="my-info border-b-2 border-b-gray-300 mx-10 p-2">
        <div className="flex justify-between mb-1">
          <p className="text-md text-textColor-gray text-start">생년월일</p>
          <p className="text-lg text-textColor-black text-end">
            {myInfo.birthDate}
          </p>
        </div>
        <div className="flex justify-between mb-1">
          <p className="text-md text-textColor-gray text-start">이메일</p>
          <p className="text-lg text-textColor-black text-end">
            {myInfo.email}
          </p>
        </div>
        <div className="flex justify-between mb-1">
          <p className="text-md text-textColor-gray text-start">지역</p>
          <p className="text-lg text-textColor-black text-end">
            {myInfo.region}
          </p>
        </div>
        <div className="flex justify-between mb-1">
          <p className="text-md text-textColor-gray text-start">재배 작물</p>
          <p className="text-lg text-textColor-black text-end">
            {myInfo.crops.join(", ")}
          </p>
        </div>
      </div>
      <div className="profile-modify grid grid-cols-2 gap-6 mx-10 mt-4 p-2">
        <div className="flex flex-col items-center">
          <button
            className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2"
            onClick={handleChatting}
          >
            <MessageSquare size={20} />
          </button>
          <p className="text-sm text-textColor-black">채팅 보러가기</p>
        </div>

        <div className="flex flex-col items-center">
          <button
            className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2"
            onClick={handleMetorSetting}
          >
            <Settings size={20} />
          </button>
          <p className="text-sm text-textColor-black">멘토 정보 수정</p>
        </div>

        <div className="flex flex-col items-center">
          <button
            className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2"
            onClick={handleMyInfoSetting}
          >
            <User size={20} />
          </button>
          <p className="text-sm text-textColor-black">회원 정보 수정</p>
        </div>

        <div className="flex flex-col items-center">
          <button
            className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2"
            onClick={handleMyPasswordSetting}
          >
            <Lock size={20} />
          </button>
          <p className="text-sm text-textColor-black">비밀번호 수정</p>
        </div>
      </div>

      <MyPageModal
        ref={modalRef}
        title={modalTitle}
        onConfirm={handleConfirm}
        children={modalContent} // 또는 그냥 {modalContent}
      />
    </div>
  );
};

export default MyProfile;
