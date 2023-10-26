import React from "react";
import { Helmet } from "react-helmet-async";

const NotFoundPage: React.FC = () => {
  const videoNum = Math.floor(Math.random() * 4) + 1;
  return (
    <section className="container animate__animated animate__fadeIn">
      <Helmet>
        <title>Page Not Found</title>
        <meta
          name="description"
          content="The page you are looking for does not exist. Please check the URL and try again."
        />
      </Helmet>
      <video src={`../assets/videos/not-found-${videoNum}.mp4`} autoPlay loop muted playsInline></video>
      <div className="not-found-wrapper">
        <h2 className="heading animate__animated animate__fadeInDown">Page Not Found</h2>
        <p className="animate__animated animate__fadeInUp">
          The page you are looking for does not exist.<br />Please check the URL and try again.
        </p>
      </div>
    </section>
  );
};

export default NotFoundPage;
