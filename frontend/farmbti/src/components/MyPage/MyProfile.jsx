import leaveIcon from "../../asset/mypage/leaves.svg";
import { Camera, MessageSquare, User, Settings, Lock } from "lucide-react";

const MyProfile = ({ myInfo }) => {
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
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
            <MessageSquare size={20} />
          </div>
          <p className="text-sm">채팅</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
            <User size={20} />
          </div>
          <p className="text-sm">회원 정보 수정</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
            <Settings size={20} />
          </div>
          <p className="text-sm">멘토 정보 수정</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
            <Lock size={20} />
          </div>
          <p className="text-sm">비밀번호 수정</p>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
