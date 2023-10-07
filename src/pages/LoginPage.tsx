import React, { useState } from "react";
import {
  getAuth,
  browserLocalPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const auth = getAuth();
    auth.setPersistence(browserLocalPersistence);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred.");
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
      {error && <p className="login-error">{error}</p>}
    </div>
  );
};

export default LoginPage;
