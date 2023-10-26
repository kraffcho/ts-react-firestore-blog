import React from "react";
import { Helmet } from "react-helmet-async";

const NotFoundPage: React.FC = () => {
  return (
    <section className="container animate__animated animate__fadeIn">
      <Helmet>
        <title>Page Not Found</title>
        <meta
          name="description"
          content="The page you are looking for does not exist. Please check the URL and try again."
        />
      </Helmet>
      <div className="not-found-wrapper">
        <svg
          className="magnifier-svg animate__animated animate__jello"
          width="200"
          height="200"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="7" stroke="#333" strokeWidth="2" fill="none" />
          <line x1="16" y1="16" x2="21" y2="21" stroke="#333" strokeWidth="2" />
        </svg>

        <h2 className="heading animate__animated animate__fadeInDown">Page Not Found</h2>
        <p className="animate__animated animate__fadeInUp">
          The page you are looking for does not exist.<br />Please check the URL and try again.
        </p>
      </div>
    </section>
  );
};

export default NotFoundPage;
