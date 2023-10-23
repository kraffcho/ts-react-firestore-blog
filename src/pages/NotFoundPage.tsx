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
      <h2 className="heading">Page Not Found</h2>
        <p>The page you are looking for does not exist. Please check the URL and try again.</p>
    </section>
  );
};

export default NotFoundPage;
