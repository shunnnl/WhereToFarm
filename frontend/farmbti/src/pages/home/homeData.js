import homeimage_1 from "../../asset/home/home_image_1.svg";
import homeimage_2 from "../../asset/home/home_image_2.svg"; 
import homeimage_3 from "../../asset/home/home_image_3.svg"; 
import icon_1 from "../../asset/home/가이드.svg";
import icon_2 from "../../asset/home/매물.svg";
import icon_3 from "../../asset/home/혜택.svg";
import icon_4 from "../../asset/home/작물_계산기.svg";

// 배너 슬라이더 데이터
export const bannerSlides = [
  {
     src: homeimage_1,
     alt: "Home Banner Image 1",
    button: null // 첫 번째 페이지는 버튼 없음
  },
  {
     src: homeimage_2,
     alt: "Home Banner Image 2",
    button: {
      text: "자세히 보기",
      link: "/detail-page-2" // 나중에수정
    }
  },
  {
     src: homeimage_3,
     alt: "Home Banner Image 3",
    button: {
      text: "신청하기",
      link: "/apply" // 나중에 수정
    }
  },
];

// 서비스 아이콘 메뉴 데이터
export const serviceIcons = [
  {
    icon: icon_1,
    title: "가이드북",
    link: "/guidebook"
  },
  {
    icon: icon_2, // 실제로는 icon_2.svg로 변경해야 함
    title: "매물",
    link: "/reservation"
  },
  {
    icon: icon_3, // 실제로는 icon_3.svg로 변경해야 함
    title: "혜택",
    link: "/check"
  },
  {
    icon: icon_4, 
    title: "작물_계산기",
    link: "/calculator"
  }
];

// 주요 서비스 데이터
export const mainServices = [
  {
    title: "귀농희망자를 위한 원스톱 서비스",
    description: "귀농을 꿈꾸는 도시민에게 필요한 정보와 서비스를 한곳에서 제공합니다."
  },
  // 추가 서비스 항목들을 여기에 추가할 수 있습니다.
];