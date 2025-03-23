const MyProfile = ({ myInfo }) => {
  return (
    <div>
      <div className="profile-img m-10 flex">
        <img
          src={myInfo.userImage}
          alt={`${myInfo.userName}님의 프로필 사진`}
          className="rounded-full w-40 h-40 border-4 border-accentGreen"
        />
        <div>
            <p>수정</p>
        </div>
        <div
          className={
            myInfo.isMentor
              ? `w-10 text-center bg-accentGreen rounded-md`
              : `w-10 text-center bg-primaryGreen rounded-md`
          }
        >
          {myInfo.isMentor ? "멘토" : "멘티"}
        </div>
      </div>
      <div className="greeting mx-10 p-2 border-b-2 border-b-gray-300">
        <span className="text-xl text-textColor-black">{myInfo.userName}{" "}</span>
        <span className="text-lg text-textColor-black">님,</span>
        <p className="text-xl text-textColor-black">오늘도 안녕하세요 :)</p>
      </div>
      <div className="my-info mx-10 px-2 py-4 border-b-2 border-b-gray-300">
        <div className="flex justify-between mb-1">
            <p className="text-lg text-textColor-black text-start">생년월일</p>
            <p className="text-lg text-textColor-black text-end">{myInfo.birthDate}</p>
        </div>
        <div className="flex justify-between mb-1">
            <p className="text-lg text-textColor-black text-start">이메일</p>
            <p className="text-lg text-textColor-black text-end">{myInfo.email}</p>
        </div>
        <div className="flex justify-between mb-1">
            <p className="text-lg text-textColor-black text-start">지역</p>
            <p className="text-lg text-textColor-black text-end">{myInfo.region}</p>
        </div>
        <div className="flex justify-between mb-1">
            <p className="text-lg text-textColor-black text-start">재배 작물</p>
            {myInfo.crops.map((crop)=>{
                return <span className="text-lg text-textColor-black text-end">{crop}</span>
            })}
        </div>
      </div>
      <div className="profile-modify flex mx-10 p-2 justify-between">
        <div>
            <p>채팅</p>
        </div>
        <div>
            <p>회원 정보 수정</p>
        </div>
        <div>
            <p>멘토 정보 수정</p>
        </div>
        <div>
            <p>비밀번호 수정</p>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
