import React, { useState, useEffect } from "react";
import { formatDate } from "../utils/formatDate";
import { handleLogout } from "../utils/auth";
import LogoutModal from "./LogoutModal";
import { Link } from "react-router-dom";

interface User {
  email: string;
  uid: string;
  metadata?: {
    creationTime?: string;
    lastSignInTime?: string;
  };
}

interface ReduxState {
  user: User;
  roles: { [key: string]: string };
}

const getRandomMessage = () => {
  const messages = [
    "Hope you're having a fantastic day!",
    "Let's make today a great day!",
    "Anything exciting planned today?",
    "Remember to take breaks and stay hydrated!",
    "You're doing great. Keep it up!",
    "Need any help? Just ask!",
    "Stay positive and focused.",
    "Great things never come from comfort zones.",
    "Chase your dreams today!",
    "Feeling inspired? Share a story with us today!",
    "There's a community here, eager to hear your voice.",
    "Every post you share leaves a mark. Keep writing!",
    "Your words have the power to inspire many.",
    "Dive deep into your thoughts and let the words flow.",
    "The world is waiting to hear your unique perspective.",
    "Your stories are a beacon for others. Keep shining!",
    "Every writer started with a single word. Keep going!",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};

const getTimeBasedGreeting = (name: string) => {
  const currentHour = new Date().getHours();
  if (currentHour >= 0 && currentHour < 6) {
    return `You're up early, ${name}!`;
  } else if (currentHour >= 6 && currentHour < 12) {
    return `Good morning, ${name}!`;
  } else if (currentHour >= 12 && currentHour < 18) {
    return `Good afternoon, ${name}!`;
  } else if (currentHour >= 18 && currentHour < 22) {
    return `Good evening, ${name}!`;
  } else {
    return `Still awake, ${name}? It's getting late!`;
  }
};

const UserProfile: React.FC<ReduxState> = ({ user, roles }) => {
  const [showModal, setShowModal] = useState(false);
  const [additionalMessage, setAdditionalMessage] = useState(
    getRandomMessage()
  );

  const logoutHandler = (event: React.MouseEvent) => {
    event.preventDefault();
    handleLogout(
      () => setShowModal(true),
      (error) => console.error("Error logging out:", error)
    );
  };

  useEffect(() => {
    const messageEl = document.querySelector(".user-profile__greetings");
    if (messageEl) {
      messageEl.classList.remove("fade-in");
      setTimeout(() => {
        setAdditionalMessage(getRandomMessage());
        messageEl.classList.add("fade-in");
      }, 50);
    }
  }, [user, roles]);

  if (!user) {
    return (
      <>
        {showModal && <LogoutModal onClose={() => setShowModal(false)} />}
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
      </>
    );
  }

  const creationDate = user.metadata?.creationTime;
  const lastLoginDate = user.metadata?.lastSignInTime;
  const formattedDate = formatDate(new Date(creationDate || ""));
  const formattedLastLoginDate = lastLoginDate
    ? formatDate(new Date(lastLoginDate))
    : "Unknown";

  const name = user.email.split("@")[0];
  const role = roles[user.uid] || "Member";

  const greetingMessage = getTimeBasedGreeting(name);

  return (
    <div className="user-profile animate__animated animate__fadeIn">
      <h2>
        <span className="material-symbols-outlined">emoji_people</span>
        Write, Share, Inspire!
      </h2>
      <p
        className={`user-profile__greetings ${
          additionalMessage ? "fade-in" : ""
        }`}
      >
        {greetingMessage} {additionalMessage}
      </p>
      <h4>More about you:</h4>
      <div className="user-profile__details">
        <p>
          <strong>Username:</strong> <span>{name}</span>
        </p>
        <p>
          <strong>Current Role:</strong> <span className="role">{role}</span>
        </p>
        <p>
          <strong>Joined Date:</strong> <span>{formattedDate}</span>
        </p>
        <p>
          <strong>Last Login:</strong> <span>{formattedLastLoginDate}</span>
        </p>
      </div>
      <p>{user.email}</p>
      <div className="login-logout">
        <Link to="/saved" className="btn green">
          Saved Posts
        </Link>
        <button onClick={logoutHandler} className="btn light-gray">
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
