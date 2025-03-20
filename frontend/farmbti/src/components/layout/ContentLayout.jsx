import React from 'react';

// fullWidth가 true일 경우 콘텐츠가 전체 너비를 차지합니다.
// 배너 이미지와 같은 요소에 사용합니다.
const ContentLayout = ({ children, fullWidth = false }) => {
  if (fullWidth) {
    return ( // 이 기술은 부모 요소의 너비 제한을 무시하고 전체 화면 너비를 차지하게 합니다
      <div className="relative w-full left-[50%] right-[50%] -mx-[50vw] max-w-[100vw]">
        <div className="w-screen">{children}</div>
      </div>);
  }
  
  return (
    <div className="max-w-screen-2xl mx-auto px-24">
      {children}
    </div>
  );
};

export default ContentLayout;