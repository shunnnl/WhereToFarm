import { useRef, useState } from "react";
import leaveIcon from "../../asset/mypage/leaves.svg";
import { Camera, MessageSquare, User, Settings, Lock } from "lucide-react";
import MyPageModal from "./MyPageModal";
import MentorSettingContent from "./MentorSettingContent";
import MyInfoSettingContent from "./MyInfoSettingContent";
import { toast } from "react-toastify";

const MyProfile = ({ myInfo }) => {
  const modalRef = useRef(null);
  const [modalType, setModalType] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  // 모달 타입 별 상태 분리
  const [mentorFormData, setMentorFormData] = useState({
    Year: "",
    foodType: "",
    description: "",
  });
  const [myInfoFormData, setMyInfoFormData] = useState({
    gender: "",
    Year: "",
    Month: "",
    Day: "",
    address: "",
  });
  const [passwordFormData, setPasswordFormData] = useState(null);
  // 디버깅용 데이터 출력
  const [formData, setFormData] = useState(null);

  // 상태, 예외 처리
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChatting = () => {
    // chat 페이지로 넘어가기
    return;
  };

  const handleMetorSetting = () => {
    setModalType("mentor");
    setModalTitle("멘토 정보 수정");
    modalRef.current?.openModal();
  };

  const handleMyInfoSetting = () => {
    setModalType("myInfo");
    setModalTitle("회원 정보 수정");
    modalRef.current?.openModal();
  };

  const handleMyPasswordSetting = () => {
    setModalType("password");
    setModalTitle("비밀번호 수정");
    modalRef.current?.openModal();
  };

  const handleConfirm = async () => {
    console.log("수정 시작...");
    console.log("현재 modalType:", modalType);

    try {
      setIsSubmitting(true);

      switch (modalType) {
        case "mentor":
          console.log("멘토 모드 - 제출 전 데이터:", mentorFormData);
          if (mentorFormData) {
            // 멘토 정보 수정 로직
            // 여기서 실제 API 호출이 이루어질 것입니다
            console.log("멘토 정보 업데이트 성공!");
            setFormData(mentorFormData);

            // 데이터 확인
            console.log("업데이트 후 formData:", mentorFormData);
            toast.success("멘토 정보가 수정 되었습니다.")
          }
          break;

        case "myInfo":
          console.log("내 정보 모드 - 제출 전 데이터:", myInfoFormData);
          if (myInfoFormData) {
            // 회원 정보 수정 로직
            console.log("회원 정보 업데이트 성공!");
            setFormData(myInfoFormData);

            // 데이터 확인
            console.log("업데이트 후 formData:", myInfoFormData);
            toast.success("회원 정보가 수정 되었습니다.");
          }
          break;

        case "password":
          console.log("비밀번호 모드 - 제출 전 데이터:", passwordFormData);
          if (passwordFormData) {
            // 비밀번호 수정 로직
            console.log("비밀번호 변경 성공!");
            setFormData(passwordFormData);

            // 데이터 확인
            console.log("업데이트 후 formData:", passwordFormData);
            toast.success("비밀번호가 수정 되었습니다.");
          }
          break;

        default:
          console.log("알 수 없는 modalType:", modalType);
          break;
      }
    } catch (error) {
      console.error("정보 업데이트 실패", error);
      console.log("에러 세부 정보:", error.message);
      toast.error("정보 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
      console.log("제출 프로세스 완료");
    }

    // 최종 데이터 확인 (모든 경우에 실행)
    console.log("모달 닫기");
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

      {/* 재사용 가능한 모달 */}
      <MyPageModal
        ref={modalRef}
        title={modalTitle}
        isLoading={isSubmitting}
        onConfirm={handleConfirm}
        onCancel={() => setFeedbackMessage({ type: "", message: "" })}
      >
        {/* 조건부 콘텐츠 렌더링 */}
        {modalType === "mentor" && (
          <MentorSettingContent
            initialData={mentorFormData}
            onChange={setMentorFormData}
          />
        )}
        {modalType === "myInfo" && (
          <MyInfoSettingContent
            initialData={myInfoFormData}
            onChange={setMyInfoFormData}
          />
        )}
      </MyPageModal>
    </div>
  );
};

export default MyProfile;
