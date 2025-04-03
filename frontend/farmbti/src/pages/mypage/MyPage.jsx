import { useState, useEffect } from "react";
import MyProfile from "../../components/mypage/MyProfile";
import { getMyPage } from "../../API/mypage/MyPageAPI";

import { Outlet, NavLink } from "react-router";
import { handleError } from "../../utils/ErrorUtil";

const MyPage = () => {
  const [myInfo, setMyInfo] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    const getMyInfo = async () => {
      try {
        const userInfo = await getMyPage();
        setMyInfo(userInfo);
        console.log(userInfo);
      } catch (error) {
        handleError(error);
        console.log(error);
      }
    };
    getMyInfo();
  }, []);
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
