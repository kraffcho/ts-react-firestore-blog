import React from "react";

interface UserDetailsProps {
  user: any;
  role: string;
  formattedDate: string;
  formattedLastLoginDate: string;
}

const UserDetails: React.FC<UserDetailsProps> = ({
  user,
  role,
  formattedDate,
  formattedLastLoginDate,
}) => {
  const name = user.email.split("@")[0];
  return (
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
  );
};

export default UserDetails;
