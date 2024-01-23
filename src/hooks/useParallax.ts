import { useEffect } from 'react';

const useParallax = () => {
  useEffect(() => {
    const handleScroll = () => {
      // Check if the device is a mobile device based on the screen width
      if (window.innerWidth > 768) {
        const scrollPosition = window.scrollY;
        const backgroundPosition = scrollPosition * 0.2;
        const scale = 1 + scrollPosition * 0.0002;

        document.body.style.backgroundSize = `${100 * scale}% ${100 * scale}%`;
        document.body.style.backgroundPosition = `center ${-backgroundPosition}px`;
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Reset background properties when component unmounts
      document.body.style.backgroundPosition = 'fixed center';
      document.body.style.backgroundSize = 'cover';
    };
  }, []);
};

export default useParallax;
