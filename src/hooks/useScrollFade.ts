import { useState, useEffect } from "react";

/**
 * A hook that returns true if the user scrolls more than a specific distance
 * from the top and is scrolling down, and false otherwise.
 */
const useScrollFade = (distance: number = 200) => {
  const [isFaded, setIsFaded] = useState(false);

  useEffect(() => {
    let lastScrollTop = 0; // to track the scroll direction

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
