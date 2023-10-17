import { useState, useEffect } from "react";

const ReadingProgressBar = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [showClose, setShowClose] = useState(false);

  const calculateScrollDistance = () => {
    const totalHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (window.scrollY / totalHeight) * 100;
    setScrollPosition(scrollPercent);
  };

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("hideProgressBar", "true");
  };

  useEffect(() => {
    if (sessionStorage.getItem("hideProgressBar") === "true") {
      setIsVisible(false);
    }

    window.addEventListener("scroll", calculateScrollDistance);
    return () => window.removeEventListener("scroll", calculateScrollDistance);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="reading-progress-bar"
      onMouseEnter={() => setShowClose(true)}
      onMouseLeave={() => setShowClose(false)}
    >
      <div
        className="progress-indicator"
        style={{ width: `${scrollPosition}%` }}
      ></div>
      {showClose && (
        <span
          onClick={handleClose}
          className="close-btn animate__animated animate__fadeInRight"
        >
          <span className="material-symbols-outlined">close</span>
        </span>
      )}
    </div>
  );
};

export default ReadingProgressBar;
