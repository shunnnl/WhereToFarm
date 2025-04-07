import { useEffect, useRef, useState, useMemo } from "react";
import leaveIcon from "../../asset/mypage/leaves.png";
import { MessageSquare, User, Settings, Lock } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import {
  putMyInfo,
  changePassword,
  putMentorInfo,
} from "../../API/mypage/MyPageAPI";

import MyPageModal from "./MyPageModal";
import MentorSettingContent from "./MentorSettingContent";
import MyInfoSettingContent from "./MyInfoSettingContent";
import MyPasswordContent from "./MyPasswordContent";
import MyProfileImage from "./MyProfileImage";
import ProfileSkeleton from "./skeleton/ProfileSkeleton";
import { handleError } from "../../utils/ErrorUtil";

const MyProfile = ({ myInfo: initialMyInfo, isLoading = false }) => {
  const modalRef = useRef(null);
  const passwordContentRef = useRef(null);
  const mentorSettingRef = useRef(null);
  const myInfoSettingRef = useRef(null);
  const [modalType, setModalType] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [myInfo, setMyInfo] = useState(null);
  const navigate = useNavigate();

  // 모달 타입 별 상태 분리
  const [mentorFormData, setMentorFormData] = useState({
    data: {},
    isValid: true,
    errors: {},
  });
  const [myInfoFormData, setMyInfoFormData] = useState({
    data: {},
    isValid: true,
    errors: {},
  });
  const [passwordFormData, setPasswordFormData] = useState({
    data: { password: "", newPassword: "", confirmNewPassword: "" },
    isValid: true,
    errors: {},
  });

  // 상태, 예외 처리
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 데이터에서 파생되는 값은 useMemo로 계산 (불필요한 재계산 방지)
  const birth = useMemo(() => {
    if (!myInfo?.birth) return { year: "", month: "", day: "" };
    const birthDate = new Date(myInfo.birth);
    return {
      year: birthDate.getFullYear().toString(),
      month: (birthDate.getMonth() + 1).toString(),
      day: birthDate.getDate().toString(),
    };
  }, [myInfo?.birth]);

  const address = useMemo(() => {
    if (!myInfo?.address) return "";
    const addressParts = myInfo.address.split(" ");
    return `${addressParts[0]} ${addressParts[1] || ""}`;
  }, [myInfo?.address]);

  const myImage = useMemo(() => {
    return {
      isDefaultImage: myInfo?.isDefaultImage || false,
      imageUrl: myInfo?.profileImage || "",
    };
  }, [myInfo?.isDefaultImage, myInfo?.profileImage]);

  // 초기 데이터 로딩 처리 - 지연 없이 바로 상태 업데이트
  useEffect(() => {
    if (!isLoading && initialMyInfo && Object.keys(initialMyInfo).length > 0) {
      setMyInfo(initialMyInfo);
    }
  }, [initialMyInfo, isLoading]);

  // MyInfoFormData 초기화 (myInfo가 변경될 때만)
  useEffect(() => {
    if (!myInfo) return;

    setMyInfoFormData({
      data: {
        name: myInfo.name || "",
        gender: myInfo.gender || 0,
        year: birth.year,
        month: birth.month,
        day: birth.day,
        address: myInfo.address || "",
      },
      isValid: true,
      errors: {},
    });

    // 멘토 정보도 초기화
    if (myInfo.isMentor) {
      setMentorFormData({
        data: {
          farmingYears: myInfo.farmingYears,
          cropNames: myInfo.cropNames,
          bio: myInfo.bio,
        },
        isValid: true,
        errors: {},
      });
    }
  }, [myInfo, birth]); // birth는 useMemo로 계산되므로 의존성에 추가해도 됨

  const handleChatting = () => {
    navigate("/chat");
  };

  const handleMetorSetting = () => {
    setModalType("mentor");
    setModalTitle("멘토 정보 수정");

    if (mentorSettingRef.current) {
      mentorSettingRef.current.resetForm();
    }
    modalRef.current?.openModal();
  };

  const handleMyInfoSetting = () => {
    setModalType("myInfo");
    setModalTitle("회원 정보 수정");

    // 최신 데이터로 폼 초기화
    setMyInfoFormData({
      data: {
        name: myInfo.name || "",
        gender: myInfo.gender || 0,
        year: birth.year,
        month: birth.month,
        day: birth.day,
        address: myInfo.address || "",
      },
      isValid: true,
      errors: {},
    });

    if (myInfoSettingRef.current) {
      myInfoSettingRef.current.resetForm();
    }
    modalRef.current?.openModal();
  };

  const handleMyPasswordSetting = () => {
    setModalType("password");
    setModalTitle("비밀번호 수정");
    // 비밀번호 폼 초기화
    if (passwordContentRef.current) {
      passwordContentRef.current.resetForm();
    }
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

  const createISODate = (
    year,
    month,
    day,
    hours = 0,
    min = 0,
    sec = 0,
    milisec = 0
  ) => {
    const date = new Date(
      Date.UTC(year, month - 1, day, hours, min, sec, milisec)
    );
    return date.toISOString();
  };

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);

      switch (modalType) {
        case "mentor":
          if (!mentorFormData.isValid) {
            const errorMessage =
              Object.values(mentorFormData.errors).find((msg) => msg) ||
              "멘토 정보를 확인해주세요";
            return;
          }

          const mentorResponse = await putMentorInfo(mentorFormData.data);

          setMyInfo((prevInfo) => ({
            ...prevInfo,
            farmingYears: mentorFormData.data.farmingYears,
            cropNames: mentorFormData.data.cropNames,
            bio: mentorFormData.data.bio,
          }));

          toast.success("멘토 정보가 수정 되었습니다.");
          break;

        case "myInfo":
          if (!myInfoFormData.isValid) {
            // 첫 번째 오류 메시지 또는 기본 메시지 표시
            const errorMessage =
              Object.values(myInfoFormData.errors).find((msg) => msg) ||
              "나의 정보를 확인해주세요";
            return;
          }

          // 유효한 경우 API 호출 및 처리
          const birth = createISODate(
            myInfoFormData.data.year,
            myInfoFormData.data.month,
            myInfoFormData.data.day
          );
          const name = myInfoFormData.data.name;
          const address = myInfoFormData.data.address;
          const gender = myInfoFormData.data.gender;

          // API 호출
          const myInfoResponse = await putMyInfo({
            name,
            address,
            birth,
            gender,
          });

          

          // 성공했다면 로컬 상태 업데이트
          if (myInfoResponse.success) {
            // UI에 즉시 반영하기 위해 상태 업데이트
            setMyInfo(myInfoResponse.data);
            const userData = {
              id: myInfoResponse.data.userId,
              email: myInfoResponse.data.email,
              name: myInfoResponse.data.name,
              address: myInfoResponse.data.address,
              gender: myInfoResponse.data.gender,
              profileImage: myInfoResponse.data.profileImage
            };;
            localStorage.setItem("user", JSON.stringify(userData));
            toast.success("회원 정보가 수정 되었습니다.");
          }
          break;

        case "password":
          if (!passwordFormData.isValid) {
            // 첫 번째 오류 메시지 또는 기본 메시지 표시
            const errorMessage =
              Object.values(passwordFormData.errors).find((msg) => msg) ||
              "비밀번호 정보를 확인해주세요";
            return;
          }

          // 유효한 경우 API 호출 및 처리
          const currentPassword = passwordFormData.data.password;
          const newPassword = passwordFormData.data.newPassword;
          const passwordResponse = await changePassword({
            currentPassword,
            newPassword,
          });

          if (passwordResponse) {
            toast.success("비밀번호 정보가 수정 되었습니다.");
          }
          break;

        default:
          break;
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
      modalRef.current?.closeModal();
    }
  };

  const handleCancel = () => {
    if (modalType === "mentor" && mentorSettingRef.current) {
      mentorSettingRef.current.resetForm();
    } else if (modalType === "myInfo" && myInfoSettingRef.current) {
      myInfoSettingRef.current.resetForm();
    } else if (modalType === "password" && passwordContentRef.current) {
      passwordContentRef.current.resetForm();
    }

    modalRef.current?.closeModal();
  };

  // 스켈레톤 UI를 위한 최소 높이 클래스
  const containerStyle = "min-h-screen";

  // 로딩 중이거나 데이터가 없을 때 스켈레톤 표시
  if (isLoading || !myInfo) {
    return (
      <div className={containerStyle}>
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div className={containerStyle}>
      <div className="flex flex-col items-center pt-10">
        <MyProfileImage
          imageUrl={myImage.imageUrl}
          isDefaultImage={myImage.isDefaultImage}
        />
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
            {myInfo.name}{" "}
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
            {birth.year}년 {birth.month}월 {birth.day}일
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
          <p className="text-lg text-textColor-black text-end">{address}</p>
        </div>
        {myInfo.isMentor && (
          <div className="flex justify-between mb-1">
            <p className="text-md text-textColor-gray text-start">재배 작물</p>
            <div className="relative group">
              {/* 최대 3개 작물만 표시하고 나머지는 +N개로 표시 */}
              <p className="text-lg text-textColor-black text-end max-w-[200px] truncate">
                {myInfo.cropNames.length <= 3
                  ? myInfo.cropNames.join(", ")
                  : `${myInfo.cropNames.slice(0, 3).join(", ")} +${
                      myInfo.cropNames.length - 3
                    }개`}
              </p>
              {/* 호버 시 모든 작물 표시 */}
              {myInfo.cropNames.length > 0 && (
                <div className="absolute hidden group-hover:block right-0 bg-white shadow-md p-2 rounded-md z-10 min-w-[150px] max-w-[300px]">
                  <ul className="text-sm text-textColor-black whitespace-normal break-words">
                    {myInfo.cropNames.map((crop, index) => (
                      <li key={index} className="py-1">
                        {crop}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
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
        onCancel={handleCancel}
      >
        {/* 조건부 콘텐츠 렌더링 */}
        {modalType === "mentor" && (
          <MentorSettingContent
            ref={mentorSettingRef} // ref 전달
            initialData={
              myInfo.isMentor
                ? {
                    farmingYears: myInfo.farmingYears,
                    cropNames: myInfo.cropNames,
                    bio: myInfo.bio,
                  }
                : {}
            }
            onChange={setMentorFormData}
            birthYear={birth.year}
          />
        )}
        {modalType === "myInfo" && (
          <MyInfoSettingContent
            ref={myInfoSettingRef} // ref 추가
            initialData={{
              name: myInfo.name || "",
              gender: myInfo.gender || 0,
              year: birth.year,
              month: birth.month,
              day: birth.day,
              address: myInfo.address || "",
            }}
            onChange={setMyInfoFormData}
          />
        )}
        {modalType === "password" && (
          <MyPasswordContent
            ref={passwordContentRef}
            onChange={setPasswordFormData}
          />
        )}
      </MyPageModal>
    </div>
  );
};

export default MyProfile;
