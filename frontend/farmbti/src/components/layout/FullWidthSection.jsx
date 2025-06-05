import React from 'react';

const FullWidthSection = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`w-screen max-w-none relative left-1/2 -translate-x-1/2 overflow-hidden h-[612px] ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export default FullWidthSection;