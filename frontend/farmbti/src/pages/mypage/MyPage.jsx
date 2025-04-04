import { useState, useEffect } from "react";
import MyProfile from "../../components/mypage/MyProfile";
import { getMyPage } from "../../API/mypage/MyPageAPI";
import { Outlet, NavLink } from "react-router";
import { handleError } from "../../utils/ErrorUtil";
import { Loader2 } from "lucide-react"; // Import Loader icon from lucide-react

const MyPage = () => {
  const [myInfo, setMyInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const getMyInfo = async () => {
      setIsLoading(true);
      try {
        const userInfo = await getMyPage();
        setMyInfo(userInfo);
        console.log(userInfo);
      } catch (error) {
        handleError(error);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getMyInfo();
  }, []);

  // Loading skeleton component
  const ProfileSkeleton = () => (
    <div className="animate-pulse">
      <div className="flex flex-col items-center pt-10">
        <div className="w-24 h-24 bg-gray-200 rounded-full mb-2"></div>
        <div className="w-16 h-6 bg-gray-200 rounded-full my-2"></div>
      </div>
      <div className="mx-10 p-2 border-b-2 border-b-gray-300 flex justify-between">
        <div className="w-3/4">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="w-16 h-16 bg-gray-200 rounded"></div>
      </div>
      <div className="border-b-2 border-b-gray-300 mx-10 p-2">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex justify-between mb-3">
            <div className="w-1/4 h-5 bg-gray-200 rounded"></div>
            <div className="w-1/2 h-5 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
      <div className="flex justify-around mx-10 mt-4 p-2">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
            <div className="w-20 h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const ContentSkeleton = () => (
    <div className="animate-pulse">
      <div className="flex justify-between text-center m-7">
        <div className="w-1/2 px-16 py-3">
          <div className="h-8 bg-gray-200 rounded mx-auto w-32"></div>
        </div>
        <div className="w-1/2 px-16 py-3">
          <div className="h-8 bg-gray-200 rounded mx-auto w-32"></div>
        </div>
      </div>
      <div className="m-10">
        <div className="h-64 bg-gray-200 rounded w-full mb-4"></div>
        <div className="h-32 bg-gray-200 rounded w-full mb-4"></div>
        <div className="h-48 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );

  // Optional: Full page loader for initial load
  if (isLoading && Object.keys(myInfo).length === 0) {
    return (
      <div className="mypage-container bg-gradient-to-b from-[#FFFCF2] to-secondaryYellow-light flex min-h-screen">
        <div className="w-1/3 h-screen bg-white mx-5 my-10 rounded-lg shadow-lg border-2">
          <ProfileSkeleton />
        </div>
        <div className="w-2/3 h-screen bg-white mx-5 my-10 rounded-lg shadow-lg border-2">
          <ContentSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="mypage-container bg-gradient-to-b from-[#FFFCF2] to-secondaryYellow-light flex">
      <div className="w-1/3 h-screen bg-white mx-5 my-10 rounded-lg shadow-lg border-2">
        <MyProfile myInfo={myInfo} />
      </div>
      <div className="w-2/3 h-screen bg-white mx-5 my-10 rounded-lg shadow-lg border-2">
        <div className="flex justify-between text-center m-7">
          <div className="w-1/2 text-xl font-medium">
            <NavLink
              to="/mypage/farmbti-report"
              className={({ isActive }) =>
                isActive
                  ? "px-16 py-3 text-supportGreen border-b-4 border-supportGreen font-semibold"
                  : "px-16 py-3 text-textColor-lightgray hover:text-textColor-darkgray"
              }
            >
              귀농 리포트
            </NavLink>
          </div>
          <div className="w-1/2 text-xl font-medium">
            <NavLink
              to="/mypage/crop-calculate-report"
              className={({ isActive }) =>
                isActive
                  ? "px-16 py-3 text-supportGreen border-b-4 border-supportGreen font-semibold"
                  : "px-16 py-3 text-textColor-lightgray hover:text-textColor-darkgray"
              }
            >
              예상 수익 리포트
            </NavLink>
          </div>
        </div>
        <div className="m-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MyPage;
