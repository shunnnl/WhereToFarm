import React from 'react';

const PageLayout = ({ children, className = '', ...props }) => {
  return (
    <main className={`container mx-auto p-4 ${className}`} {...props}>
      {children}
    </main>
  );
};

export default PageLayout;