import React, { useState, useEffect } from "react";
import { formatDate } from "../utils/formatDate";
import { handleLogout } from "../utils/auth";
import { getRandomMessage } from "../utils/messageUtils";
import Greeting from "./Greeting";
import UserDetails from "./UserDetails";
import ActionButtons from "./ActionButtons";
import LoginPrompt from "./LoginPrompt";
import LogoutModal from "./LogoutModal";

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
    return <LoginPrompt />;
  }

  const name = user.email.split("@")[0];
  const role = roles[user.uid] || "Member";
  const creationDate = user.metadata?.creationTime;
  const lastLoginDate = user.metadata?.lastSignInTime;
  const formattedDate = formatDate(new Date(creationDate || ""));
  const formattedLastLoginDate = lastLoginDate
    ? formatDate(new Date(lastLoginDate))
    : "Unknown";

  return (
    <section className="user-profile animate__animated animate__fadeIn">
      {showModal && <LogoutModal onClose={() => setShowModal(false)} />}
      <h2>
        <span className="material-symbols-outlined notranslate">emoji_people</span>
        Write, Share, Inspire!
      </h2>
      <Greeting name={name} additionalMessage={additionalMessage} />
      <UserDetails
        user={user}
        role={role}
        formattedDate={formattedDate}
        formattedLastLoginDate={formattedLastLoginDate}
      />
      <p>{user.email}</p>
      <ActionButtons logoutHandler={logoutHandler} />
    </section>
  );
};

export default UserProfile;
