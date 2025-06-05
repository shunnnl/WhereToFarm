import React from 'react';

const PageLayout = ({ children, className = '', ...props }) => {
  return (
    <main className={`container mx-auto p-2 px-16 ${className}`} {...props}>
      {children}
    </main>
  );
};

export default PageLayout;