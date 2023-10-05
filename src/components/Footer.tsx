import React from "react";
import useScrollFade from "../hooks/useScrollFade";

const Footer: React.FC = () => {
  const isFoterFaded = useScrollFade(25);
  return (
    <footer
      className={`footer-container${
        isFoterFaded
          ? " animate__animated animate__fadeInUp"
          : " animate__animated animate__fadeOutDown"
      }`}
    >
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
