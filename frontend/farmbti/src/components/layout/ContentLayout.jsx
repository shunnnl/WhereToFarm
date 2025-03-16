import React from 'react';

// fullWidth가 true일 경우 콘텐츠가 전체 너비를 차지합니다.
// 배너 이미지와 같은 요소에 사용합니다.
const ContentLayout = ({ children, fullWidth = false }) => {
  if (fullWidth) {
    return <div className="w-full">{children}</div>;
  }
  
  return (
    <div className="max-w-screen-2xl mx-auto px-8">
      {children}
    </div>
  );
};

export default ContentLayout;