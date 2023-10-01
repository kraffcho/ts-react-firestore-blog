import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <span>
          A serverless microblogging platform built with React, TypeScript,
          Redux Toolkit, and Firebase © {new Date().getFullYear()} Kraffcho
        </span>
      </div>
    </footer>
  );
};

export default Footer;
