import React from "react";
import useScrollFade from "../hooks/useScrollFade";

const ScrollToTop: React.FC = () => {
  const isVisible = useScrollFade(300);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const classes = `scroll-to-top animate__animated ${
    isVisible ? "animate__fadeInUp" : "animate__fadeOutDown"
  }`;

  return (
    <div onClick={handleScrollToTop} className={classes}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        width="40px"
        height="40px"
      >
        <path d="M5 15l7-7 7 7"></path>
      </svg>
    </div>
  );
};

export default ScrollToTop;
