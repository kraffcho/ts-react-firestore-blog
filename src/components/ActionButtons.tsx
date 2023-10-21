import React from "react";
import { Link } from "react-router-dom";

interface ActionButtonsProps {
  logoutHandler: (event: React.MouseEvent) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ logoutHandler }) => {
  return (
    <div className="login-logout">
      <Link to="/saved" className="btn green">
        Saved Posts
      </Link>
      <button onClick={logoutHandler} className="btn light-gray">
        Logout
      </button>
    </div>
  );
};

export default ActionButtons;
