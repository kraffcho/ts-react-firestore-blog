import React from "react";
import { Link } from "react-router-dom";

const LoginPrompt: React.FC = () => {
  return (
    <div className="user-profile animate__animated animate__fadeIn">
      <h2>
        <span className="material-symbols-outlined">emoji_people</span>
        Welcome to our blog!
      </h2>
      <p className="user-profile__greetings">
        Join our community and share your thoughts with the world.
      </p>
      <div className="login-logout">
        <Link to="/login" className="btn green">
          <span className="material-symbols-outlined">login</span>Login
        </Link>
        <Link to="/register" className="btn yellow">
          <span className="material-symbols-outlined">person_add</span>Register
        </Link>
      </div>
    </div>
  );
};

export default LoginPrompt;
