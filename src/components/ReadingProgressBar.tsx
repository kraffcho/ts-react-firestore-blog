import { useState, useEffect } from "react";

const ReadingProgressBar = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const calculateScrollDistance = () => {
    const totalHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (window.scrollY / totalHeight) * 100;
    setScrollPosition(scrollPercent);
  };

  useEffect(() => {
    window.addEventListener("scroll", calculateScrollDistance);
    return () => window.removeEventListener("scroll", calculateScrollDistance);
  }, []);

  return (
    <div
      style={{
        height: "8px",
        width: "100%",
        backgroundColor: "#333",
        borderBottom: "1px solid #444",
        position: "fixed",
        top: "63px",
        left: "0",
        zIndex: "999999",
      }}
    >
      <div
        style={{
          width: `${scrollPosition}%`,
          height: "100%",
          backgroundColor: "yellowgreen",
          transition: "width .3s ease-out",
        }}
      ></div>
    </div>
  );
};

export default ReadingProgressBar;
