import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getAuth, browserLocalPersistence, signInWithEmailAndPassword } from "firebase/auth";

interface FirebaseError {
  code?: string;
  message: string;
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const MIN_PASS_LENGTH = 8;

  const isValidEmail = (email: string) => {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailPattern.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsLoading(true);

    if (!isValidEmail(email)) {
      setFormError("Please enter a valid email address.");
      emailRef.current?.focus();
      setIsLoading(false);
      return;
    }

    if (password.length < MIN_PASS_LENGTH) {
      setFormError(
        `Password should be at least ${MIN_PASS_LENGTH} characters long.`
      );
      passwordRef.current?.focus();
      setIsLoading(false);
      return;
    }

    const auth = getAuth();
    auth.setPersistence(browserLocalPersistence);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const firebaseError = error as FirebaseError;
      switch (firebaseError.code) {
        case "auth/user-not-found":
          setFormError("No user found with this email address.");
          emailRef.current?.focus();
          break;
        case "auth/wrong-password":
          setFormError("Incorrect password.");
          passwordRef.current?.focus();
          break;
        case "auth/invalid-login-credentials":
          setFormError("Invalid login credentials.");
          emailRef.current?.focus();
          break;
        case "auth/too-many-requests":
          setFormError(
            "Too many failed login attempts. Please try again later."
          );
          emailRef.current?.focus();
          break;
        default:
          setFormError(
            firebaseError.message || "An unexpected error occurred."
          );
      }
      setIsLoading(false);
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
        <label htmlFor="email" className="visually-hidden">
          Email Address
        </label>
        <input
          ref={emailRef}
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          aria-label="Enter your email address"
        />
        <label htmlFor="password" className="visually-hidden">
          Password
        </label>
        <input
          ref={passwordRef}
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          aria-label="Enter your password"
        />
        <button
          type="submit"
          className="btn green stretch extra-padding"
          disabled={isLoading}
          aria-label="Login to your account"
        >
          {isLoading ? "Loading..." : "Login"}
        </button>
      </form>
      <p className="info">
        Don't have an account?
        <Link to="/register" aria-label="Register for a new account">
          Register
        </Link>
      </p>
      {formError && (
        <p
          className="error animate__animated animate__bounceIn"
          aria-live="polite"
        >
          {formError}
        </p>
      )}
    </div>
  );
};

export default LoginPage;
