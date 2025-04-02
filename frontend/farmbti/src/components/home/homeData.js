import homeimage_1 from "../../asset/home/home_image_1.png";
import homeimage_2 from "../../asset/home/home_image_2.png"; 
import homeimage_3 from "../../asset/home/home_image_3.png"; 
import { BookOpen, Home, Gift, Calculator, LandPlot } from "lucide-react";

// 배너 슬라이더 데이터
export const bannerSlides = [
  {
    src: homeimage_1,
    alt: "Home Banner Image 1",
    button: null, // 첫 번째 페이지는 버튼 없음
    text: {
      title: "귀농의 첫걸음, 똑똑하게",
      content_1: "귀농, 어디로 가야 할지 고민되시나요?",
      content_2:
        "빅데이터 분석을 통해 당신에게 딱 맞는 최적의 귀농 지역을 추천해 드립니다.",
      content_3: "지금 바로 클릭하고 새로운 시작을 준비해보세요!",
    },
  },
  {
    src: homeimage_2,
    alt: "Home Banner Image 2",
    button: {
      text: "귀농지 추천 받기",
      link: "/surveyintro",
    },
    text: {
      before: "나의 ",
      highlight: "귀농지",
      after: "는? ",
    },
  },
  {
    src: homeimage_3,
    alt: "Home Banner Image 3",
    button: {
      text: "작물 수익 계산하기",
      link: "/crop-calculator",
    },
    text: {
      title: "농부가 된다면, 나의 수익은?",
      content_1: "어떤 작물을 재배할지 고민되시나요?",
      content_2:
        "재배 면적에 따라 예상 수익, 투자 비용, 순이익까지 한 눈에 확인하고,",
      content_3: "나에게 딱 맞는 농사 계획을 세워보세요!",
    },
  },
];

// 서비스 아이콘 메뉴 데이터
export const serviceIcons = [
  {
    icon: BookOpen,
    title: "가이드북",
    link: "/guidebook"
  },
  {
    icon: LandPlot,
    title: "지역 추천",  
    link: "/surveyintro"
  },
  {
    icon: Calculator,
    title: "작물 계산기", 
    link: "/crop-calculator"
  },
  {
    icon: Home,
    title: "매물",
    link: "/estate"
  },
  {
    icon: Gift,
    title: "혜택",
    link: "/support"
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

import tempimgae from '../../asset/home/news_image.svg' 
export const newsItems = [
  {
    id: 1,
    imageUrl: tempimgae,
    title: '정남중 귀농 이유 물었더니',
    subtitle: '농업의 미래과 변천 가능성 많아..',
    moreLink: '/news/1'
  },
  {
    id: 2,
    imageUrl: tempimgae,
    title: '귀농·귀촌 정보 보급자리',
    subtitle: '지원 대상자 4곳 추가 선정',
    moreLink: '/news/2'
  },
  {
    id: 3, 
    imageUrl: tempimgae,
    title: '후계농 육성 자금 1조원으로 확대..',
    subtitle: '청년 농업인 지원 강화',
    moreLink: '/news/3'
  }
];

