import { useRef, useState } from "react";
import leaveIcon from "../../asset/mypage/leaves.svg";
import { MessageSquare, User, Settings, Lock } from "lucide-react";
import MyPageModal from "./MyPageModal";
import MentorSettingContent from "./MentorSettingContent";
import MyInfoSettingContent from "./MyInfoSettingContent";
import { toast } from "react-toastify";
import MyPasswordContent from "./MyPasswordContent";
import MyProfileImage from "./MyProfileImage";

const MyProfile = ({ myInfo }) => {
  const modalRef = useRef(null);
  const [modalType, setModalType] = useState("");
  const [modalTitle, setModalTitle] = useState("");


  // 모달 타입 별 상태 분리
  const [mentorFormData, setMentorFormData] = useState({
    data: { Year: "", foodType: "", description: "" },
    isValid: true,
    errors: {},
  });
  const [myInfoFormData, setMyInfoFormData] = useState({
    data: {
      name: myInfo.userName || "",
      gender: myInfo.gender || "",
      Year: myInfo.birthYear || "",
      Month: myInfo.birthMonth || "",
      Day: myInfo.birthDay || "",
      address: myInfo.region || "",
    },
    isValid: true,
    errors: {},
  });

  const [passwordFormData, setPasswordFormData] = useState({
    data: { currentPassword: "", newPassword: "", confirmPassword: "" },
    isValid: true,
    errors: {},
  });

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
    // 현재 사용자 정보로 폼 초기화
    setModalType("myInfo");
    setModalTitle("회원 정보 수정");
    modalRef.current?.openModal();
  };

  const handleMyPasswordSetting = () => {
    setModalType("password");
    setModalTitle("비밀번호 수정");
    modalRef.current?.openModal();
  };

  // 현재 모달 타입에 따라 폼의 유효성을 확인하는 함수
  const isCurrentFormValid = () => {
    switch (modalType) {
      case "mentor":
        return mentorFormData.isValid;
      case "myInfo":
        return myInfoFormData.isValid;
      case "password":
        return passwordFormData.isValid;
      default:
        return false;
    }
  };

  const handleConfirm = async () => {
    console.log("수정 시작...");
    console.log("현재 modalType:", modalType);
    // handleConfirm 함수 내부
    console.log("mentorFormData 전체:", mentorFormData);
    console.log("isValid 값:", mentorFormData.isValid);
    console.log("errors 객체:", mentorFormData.errors);

    try {
      setIsSubmitting(true);

      switch (modalType) {
        case "mentor":
          if (!mentorFormData.isValid) {
            // 첫 번째 오류 메시지 또는 기본 메시지 표시
            const errorMessage =
              Object.values(mentorFormData.errors).find((msg) => msg) ||
              "멘토 정보를 확인해주세요";
            return;
          }

          // 유효한 경우 API 호출 및 처리
          console.log("멘토 정보 업데이트:", mentorFormData.data);
          toast.success("멘토 정보가 수정 되었습니다.");
          break;

        case "myInfo":
          console.log("내 정보 모드 - 제출 전 데이터:", myInfoFormData.data);
          if (!myInfoFormData.isValid) {
            // 첫 번째 오류 메시지 또는 기본 메시지 표시
            const errorMessage =
              Object.values(myInfoFormData.errors).find((msg) => msg) ||
              "나의 정보를 확인해주세요";
            return;
          }

          // 유효한 경우 API 호출 및 처리
          console.log("회원 정보 업데이트:", myInfoFormData.data);
          toast.success("회원 정보가 수정 되었습니다.");
          break;

        case "password":
          console.log("비밀번호 모드 - 제출 전 데이터:", passwordFormData.data);
          if (!passwordFormData.isValid) {
            // 첫 번째 오류 메시지 또는 기본 메시지 표시
            const errorMessage =
              Object.values(passwordFormData.errors).find((msg) => msg) ||
              "비밀번호 정보를 확인해주세요";
            return;
          }

          // 유효한 경우 API 호출 및 처리
          console.log("비밀번호 정보 업데이트:", passwordFormData.data);
          toast.success("비밀번호 정보가 수정 되었습니다.");
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
        <MyProfileImage />
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
        {myInfo.isMentor && (
          <div className="flex justify-between mb-1">
            <p className="text-md text-textColor-gray text-start">재배 작물</p>
            <p className="text-lg text-textColor-black text-end">
              {myInfo.crops.join(", ")}
            </p>
          </div>
        )}
      </div>
      <div
        className={`profile-modify ${
          myInfo.isMentor ? "grid grid-cols-2 gap-6" : "flex justify-around"
        } mx-10 mt-4 p-2`}
      >
        <div className="flex flex-col items-center">
          <button
            className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2"
            onClick={handleChatting}
          >
            <MessageSquare size={20} />
          </button>
          <p className="text-sm text-textColor-black">채팅 보러가기</p>
        </div>

        {myInfo.isMentor && (
          <div className="flex flex-col items-center">
            <button
              className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2"
              onClick={handleMetorSetting}
            >
              <Settings size={20} />
            </button>
            <p className="text-sm text-textColor-black">멘토 정보 수정</p>
          </div>
        )}

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
        isFormValid={isCurrentFormValid()}
        onConfirm={handleConfirm}
      >
        {/* 조건부 콘텐츠 렌더링 */}
        {modalType === "mentor" && (
          <MentorSettingContent
            initialData={mentorFormData.data}
            onChange={setMentorFormData}
          />
        )}
        {modalType === "myInfo" && (
          <MyInfoSettingContent
            initialData={myInfoFormData.data}
            onChange={setMyInfoFormData}
          />
        )}
        {modalType === "password" && (
          <MyPasswordContent
            initialData={passwordFormData.data}
            onChange={setPasswordFormData}
          />
        )}
      </MyPageModal>
    </div>
  );
};

export default MyProfile;
