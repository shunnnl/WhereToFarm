import React from "react";

const Footer = () => {
  return (
    <footer className="flex flex-col md:flex-row justify-between items-center w-full px-6 md:px-20 py-6 bg-white border-t border-gray-200">
      <div className="mb-4 md:mb-0">
        <p className="text-sm text-center md:text-left text-gray-700">
          © 2025 어디가농 | 모든 권리 보유
        </p>
        <p className="text-xs text-center md:text-left text-gray-500 mt-1">
          데이터 출처: 농림축산식품부, 통계청, 농식품빅데이터 거래소 등 정부 및
          지자체 공공데이터
        </p>
      </div>
      <div className="flex gap-4 md:gap-8">
        <p className="text-sm text-gray-700 hover:text-green-600 cursor-pointer">
          이용약관
        </p>
        <p className="text-sm text-gray-700 hover:text-green-600 cursor-pointer">
          개인정보처리방침
        </p>
        <p className="text-sm text-gray-700 hover:text-green-600 cursor-pointer">
          문의하기
        </p>
      </div>
    </footer>
  );
};

export default Footer;
