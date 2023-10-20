import React from "react";
import { formatDate } from "../utils/formatDate";

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

  if (!user) return null;

  const creationDate = user.metadata?.creationTime;
  const lastLoginDate = user.metadata?.lastSignInTime;

  if (!creationDate) {
    console.error('No joined date or creation time found for user:', user);
    return null;
  }

  const formattedDate = formatDate(new Date(creationDate));
  const formattedLastLoginDate = lastLoginDate ? formatDate(new Date(lastLoginDate)) : "Unknown";

  const name = user.email.split("@")[0];
  const role = roles[user.uid] || "Member";

  return (
    <div className="user-profile animate__animated animate__fadeIn">
      <h2>
        <span className="material-symbols-outlined">emoji_people</span>
        Hello, {name}
      </h2>
      <p className="user-profile__greetings">It's good to see you!</p>
      <h4>User Details:</h4>
      <p>{user.email}</p>
      <div className="user-profile__details">
        <p>
          <strong>Your Role:</strong> <span className="role">{role}</span>
        </p>
        <p>
          <strong>Joined Date:</strong> <span>{formattedDate}</span>
        </p>
        <p>
          <strong>Last Login:</strong> <span>{formattedLastLoginDate}</span>
        </p>
      </div>
    </div>
  );
};

export default UserProfile;
