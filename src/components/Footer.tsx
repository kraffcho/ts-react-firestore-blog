import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="footer-container animate__animated animate__fadeIn animate__delay-1s">
      <div className="footer-content">
        <span>
          A serverless microblogging platform built with React, TypeScript,
          Redux Toolkit, and Firebase © {new Date().getFullYear()}
          <span className="author">
            Made with
            <span className="material-symbols-outlined notranslate">favorite</span> by
            <a
              href="https://www.linkedin.com/in/kraffcho/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Kraffcho
            </a>
          </span>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
