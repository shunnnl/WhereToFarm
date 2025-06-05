import React from 'react';

const ContentLayout = ({ children, fullWidth = false }) => {
  if (fullWidth) {
    return (
      <div className="relative w-screen -mx-[calc(50vw-50%)] overflow-hidden">
        {children}
      </div>
    );
  }
  
  return (
    <div className="max-w-screen-2xl mx-auto px-24">
      {children}
    </div>
  );
};

export default ContentLayout;