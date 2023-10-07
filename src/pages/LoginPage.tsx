import React, { useState } from "react";
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

  const handleLogin = async () => {
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
    <div className="login-container animate__animated animate__jackInTheBox">
      <h2 className="login-title">Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="login-input"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="login-input"
      />

      <button onClick={handleLogin} className="login-btn">
        Login
      </button>

      {formError && <p className="login-error">{formError}</p>}
    </div>
  );
};

export default LoginPage;
