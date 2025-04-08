const ProfileSkeleton = ({ isMentor }) => {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col items-center pt-10">
        <div className="mb-2">
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4"></div>
        </div>
        <div className="my-2">
          <div className="px-4 py-1 bg-gray-200 rounded-full w-16 h-6"></div>
        </div>
      </div>

      {/* 인사말 섹션 */}
      <div className="mx-10 p-2 border-b-2 border-b-gray-300 flex justify-between">
        <div className="flex-1">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>

      {/* 정보 섹션 */}
      <div className="border-b-2 border-b-gray-300 mx-10 p-2">
        {/* 생년월일, 이메일, 지역 정보 */}
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex justify-between mb-3">
            <div className="h-5 bg-gray-200 rounded w-1/4"></div>
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
        
        {/* 작물 정보 (멘토인 경우에만) */}
        {isMentor && (
          <div className="flex justify-between mb-3">
            <div className="h-5 bg-gray-200 rounded w-1/4"></div>
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          </div>
        )}
      </div>

      {/* 하단 버튼 섹션 - 동일한 조건부 레이아웃 사용 */}
      <div className={`${
        isMentor ? "grid grid-cols-2 gap-6" : "flex justify-around"
      } mx-10 mt-4 p-2`}>
        {/* 채팅 버튼 */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>

        {/* 멘토 정보 수정 (멘토인 경우에만) */}
        {isMentor && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        )}

        {/* 회원 정보 수정 */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>

        {/* 비밀번호 수정 */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;