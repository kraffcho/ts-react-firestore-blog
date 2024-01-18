import React, { useState, useEffect } from 'react';

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    setAnimateOut(true);
    localStorage.setItem('cookieConsent', 'accepted');
    setTimeout(() => setShowBanner(false), 1000); // The timeout should match the CSS animation duration
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className={`cookie-consent ${animateOut ? 'animate-out' : 'animate-in'}`}>
      <p className='cookie-consent__content'>
        We use cookies to enhance your browsing experience on our site. By continuing to use our website, you consent to our use of cookies.
      </p>
      <button className="btn green" onClick={handleAccept}>
        Accept
      </button>
    </div>
  );
};

export default CookieConsent;
