import { useRef, useState } from "react";
import leaveIcon from "../../asset/mypage/leaves.svg";
import { Camera, MessageSquare, User, Settings, Lock } from "lucide-react";
import MyPageModal from "./MyPageModal";
import MentorSettingForm from "./MentorSettingContent";
import MyInfoSettingContent from "./MyInfoSettingContent";

const MyProfile = ({ myInfo }) => {
  const modalRef = useRef(null);
  const [modalType, setModalType] = useState("");
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState("");

  // 모달 타입 별 상태 분리
  const [mentorFormData, setMentorFormData] = useState(null);
  const [userInfoFormData, setUserInfoFormData] = useState(null);
  const [passwordFormData, setPasswordFormData] = useState(null);
  // 디버깅용 데이테 출력
  const [formData, setFormData] = useState(null);

  // 상태, 예외 처리
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState({
    type: "",
    message: "",
  });

  const handleChatting = () => {
    // chat 페이지로 넘어가기
    return;
  };

  const handleMetorSetting = () => {
    setModalType("mentor");
    setModalContent(
      <MentorSettingForm
        initialData={myInfo}
        onSubmit={(data) => {
          console.log("멘토 데이터 수신:", data);
          setMentorFormData(data);
        }}
      />
    );
    setModalTitle("멘토 정보 수정");
    modalRef.current?.openModal();
    return;
  };

  const handleMyInfoSetting = () => {
    setModalType("user-info");
    setModalContent(
      <MyInfoSettingContent
        initialData={myInfo}
        onSubmit={(data) => {
          console.log("정보 수정 데이터 수신:", data);
          console.log("함수 호출")
          setUserInfoFormData(data);
        }}
      />
    );
    setModalTitle("회원 정보 수정");
    modalRef.current?.openModal();
    return;
  };

  const handleMyPasswordSetting = () => {
    setModalType("password");
    return;
  };

  const handleConfirm = async () => {
    console.log("수정 중...");
    try {
      setIsSubmitting(true);
      setFeedbackMessage({ type: "", message: "" });

      switch (modalType) {
        case "mentor":
          if (mentorFormData) {
            // 멘토 정보 수정 로직
            setFeedbackMessage({
              type: "success",
              message: "멘토 정보가 성공적으로 업데이트되었습니다.",
            });
            setFormData(mentorFormData);

            // 모달 닫기
            modalRef.current?.closeModal();
          }
          break;

        case "user-info":
          if (userInfoFormData) {
            // 회원 정보 수정 로직
            setFeedbackMessage({
              type: "success",
              message: "회원 정보가 성공적으로 업데이트되었습니다.",
            });
            setFormData(userInfoFormData);

            // 모달 닫기
            modalRef.current?.closeModal();
          }
          break;

        case "password":
          if (passwordFormData) {
            // 비밀번호 수정 로직
            setFeedbackMessage({
              type: "success",
              message: "비밀번호가 성공적으로 변경되었습니다.",
            });
            setFormData(passwordFormData);

            // 모달 닫기
            modalRef.current?.closeModal();
          }
          break;
      }
    } catch (error) {
      console.error("정보 업데이트 실패", error);
      setFeedbackMessage({
        type: "error",
        message: "정보 업데이트에 실패했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsSubmitting(false);
    }
    console.log("바뀐 데이터:", formData);
    modalRef.current?.closeModal();
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
        isLoading={isSubmitting}
        feedbackMessage={feedbackMessage}
        children={modalContent}
      />
    </div>
  );
};

export default MyProfile;
