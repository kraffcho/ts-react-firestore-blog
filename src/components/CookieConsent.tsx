import React, { useState, useEffect } from 'react';

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if the cookie consent was already accepted
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="cookie-consent animate__animated animate__fadeIn animate__delay-3s">
      <p className='cookie-consent__content'>
        We use cookies to enhance your browsing experience on our site. By continuing to use our website, you consent to our use of cookies.
      </p>
      <button className="btn purple" onClick={handleAccept}>
        Accept
      </button>
    </div>
  );
};

export default CookieConsent;
