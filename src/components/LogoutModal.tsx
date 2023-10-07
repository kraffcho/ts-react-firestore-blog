import React from "react";

const LogoutModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content animate__animated animate__fadeIn">
        <h2>You've been logged out</h2>
        <p>You have successfully logged out from the application.</p>
        <button onClick={onClose} className="btn yellow close">Close</button>
      </div>
    </div>
  );
};

export default LogoutModal;
