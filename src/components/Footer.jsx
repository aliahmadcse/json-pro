import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center p-4 mt-8 w-full bottom-0">
      <p className="text-sm">
        Made with love ❤️ by Ali - 
        <a 
          href="https://github.com/aliahmadcse/json-pro/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-400 hover:text-blue-200 ml-1"
        >
          GitHub Repository
        </a>
      </p>
    </footer>
  );
};

export default Footer;