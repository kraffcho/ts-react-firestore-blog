import React from "react";

const Footer: React.FC = () => {
  return (
    <div className="footer-container">
      <div className="footer-content">
        <span>
          A serverless microblogging platform built with React, TypeScript,
          Redux Toolkit, and Firebase © {new Date().getFullYear()} Kraffcho
        </span>
      </div>
    </div>
  );
};

export default Footer;
