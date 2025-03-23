import { Outlet, Link } from "react-router";

const MyPage = () => {
    return (<div className="mypage-container">
        <div>
            <h1>내 프로필</h1>
        </div>
        <div>
            <ul>
                <li><Link to="/mypage/farmbti-report">귀농 리포트</Link></li>
                <li><Link to="/mypage/crop-calculate-report">예상 수익 리포트</Link></li>
            </ul>
            <Outlet/>
        </div>
    </div>);
}

export default MyPage