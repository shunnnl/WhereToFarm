import MyProfile from "../../components/MyPage/MyProfile";

import { Outlet, NavLink } from "react-router";

const MyPage = () => {
  return (
    <div className="mypage-container bg-gradient-to-b from-[#FFFCF2] to-secondaryYellow-light flex">
      <div className="w-1/3 h-screen bg-white mx-5 my-10 rounded-lg shadow-lg">
        <MyProfile />
      </div>
      <div className="w-2/3 bg-white mx-5 my-10 rounded-lg shadow-lg">
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
