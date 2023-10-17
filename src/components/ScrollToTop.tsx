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
      <span className="material-symbols-outlined">vertical_align_top</span>
    </div>
  );
};

export default ScrollToTop;
