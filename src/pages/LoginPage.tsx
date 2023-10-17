import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  getAuth,
  browserLocalPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const MIN_PASS_LENGTH = 8;

  const isValidEmail = (email: string) => {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailPattern.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!isValidEmail(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (password.length < MIN_PASS_LENGTH) {
      setFormError(
        `Password should be at least ${MIN_PASS_LENGTH} characters long.`
      );
      return;
    }

    const auth = getAuth();
    auth.setPersistence(browserLocalPersistence);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="container login-register animate__animated animate__bounceIn">
      <Helmet>
        <title>Login Page</title>
        <meta
          name="description"
          content="Login to the blog. Enter your email address and password to login."
        />
      </Helmet>
      <h2 className="title">Login Page</h2>
      <form onSubmit={handleLogin}>
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />
        <button type="submit" className="btn green stretch extra-padding">
          Login
        </button>
      </form>
      <p className="info">
        Don't have an account?
        <br />
        <Link to="/register">Register</Link>
      </p>
      {formError && (
        <p className="error animate__animated animate__bounceIn">{formError}</p>
      )}
    </div>
  );
};

export default LoginPage;
