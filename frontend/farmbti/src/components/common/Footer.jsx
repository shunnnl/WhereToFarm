import React from 'react';

const Footer = () => {
  return (
    <footer className="flex justify-between items-center w-full h-16 px-20 py-6 bg-white">
      <p className="text-sm text-left text-black">
        © 2023 Maxwell Inc. All rights reserved.
      </p>
      <div className="flex gap-8">
        <p className="text-sm text-left text-black">Terms of Service</p>
        <p className="text-sm text-left text-black">Privacy Policy</p>
        <p className="text-sm text-left text-black">Cookies</p>
      </div>
    </footer>
  );
};

export default Footer;