import React from "react";

const LogoutModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content animate__animated animate__fadeIn">
        <h2>Logout successful</h2>
        <p>Your session has ended. We look forward to your next visit!</p>
        <button onClick={onClose} className="btn yellow close">Close</button>
      </div>
    </div>
  );
};

export default LogoutModal;
