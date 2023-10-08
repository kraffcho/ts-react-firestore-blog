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

  if (!isVisible) return null;

  return (
    <div
      onClick={handleScrollToTop}
      className="scroll-to-top animate__animated animate__fadeInUp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="0"
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
