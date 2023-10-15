import React from "react";
import useScrollFade from "../hooks/useScrollFade";

const Footer: React.FC = () => {
  const isFooterFaded = useScrollFade(25);
  return (
    <footer
      className={`footer-container${
        isFooterFaded
          ? " animate__animated animate__fadeOutDown"
          : " animate__animated animate__fadeInUp"
      }`}
    >
      <div className="footer-content">
        <span>
          A serverless microblogging platform built with React, TypeScript,
          Redux Toolkit, and Firebase © {new Date().getFullYear()}
          <span className="author">
            Made with
            <span className="material-symbols-outlined">favorite</span> by
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
