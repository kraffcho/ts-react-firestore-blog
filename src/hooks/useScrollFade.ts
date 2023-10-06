import { useState, useEffect } from "react";

const useScrollFade = (distance: number = 200) => {
  const [isFaded, setIsFaded] = useState(false);

  useEffect(() => {
    let lastScrollTop = 0;

    const handleScroll = () => {
      const currentScrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      if (currentScrollTop > lastScrollTop && currentScrollTop > distance) {
        setIsFaded(true);
      } else {
        setIsFaded(false);
      }
      lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [distance]);

  return isFaded;
};

export default useScrollFade;
