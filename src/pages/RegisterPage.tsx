import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  getAuth,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [formError, setFormError] = useState("");

  const MIN_PASS_LENGTH = 8;

  const isValidEmail = (email: string) => {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailPattern.test(email);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!isValidEmail(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (password !== repeatPassword) {
      setFormError("Passwords do not match.");
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
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="container login-register animate__animated animate__flipInX">
      <Helmet>
        <title>Create Account</title>
        <meta
          name="description"
          content="Register for the blog. Enter your email address and choose a password to sign up."
        />
      </Helmet>
      <h2 className="title">Create Account</h2>
      <form onSubmit={handleRegister}>
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
        <input
          id="repeat-password"
          type="password"
          placeholder="Repeat Password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          className="input"
        />
        <button type="submit" className="btn yellow stretch extra-padding">
          Register
        </button>
      </form>
      <p className="info">
        Already have an account?
        <br />
        <Link to="/login">Login</Link>
      </p>
      {formError && (
        <p className="error animate__animated animate__bounceIn">{formError}</p>
      )}
    </div>
  );
};

export default RegisterPage;
