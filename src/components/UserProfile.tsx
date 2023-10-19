import React from "react";
import { useSelector } from "react-redux";

interface User {
  email: string;
  uid: string;
  joinedDate: Date;
}

interface ReduxState {
  user: User;
  roles: { [key: string]: string };
}

const UserProfile: React.FC<ReduxState> = ({ user, roles }) => {

  if (!user) return null;

  const name = user.email.split("@")[0];
  const role = roles[user.uid] || "Member";

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(user.joinedDate);

  return (
    <div className="user-profile animate__animated animate__fadeIn">
      <h2>
        <span className="material-symbols-outlined">emoji_people</span>
        Hello, {name}
      </h2>

      <p>It's good to see you!</p>

      <h3>User Details</h3>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Role:</strong> {role}
      </p>
      <p>
        <strong>Joined Date:</strong> {formattedDate}
      </p>
    </div>
  );
};

export default UserProfile;
