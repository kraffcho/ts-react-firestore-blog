import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import LogoutModal from "./LogoutModal";

type NavbarProps = {
  user: any | null;
};

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const [showModal, setShowModal] = useState(false);
  
  const handleLogout = (event: React.MouseEvent) => {
    event.preventDefault();
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        setShowModal(true);
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <nav>
      <ul className="nav-container">
        <li className="nav-link">
          <Link to="/">
            <span className="material-symbols-outlined">house</span> Home
          </Link>
        </li>
        {user && (
          <li className="nav-link">
            <Link to="/add-post">
              <span className="material-symbols-outlined">post_add</span> Add
              Post
            </Link>
          </li>
        )}
        <li className="nav-link">
          {user ? (
            <Link to="" onClick={handleLogout}>
              <span className="material-symbols-outlined">logout</span> Log Out
            </Link>
          ) : (
            <Link to="/login">
              <span className="material-symbols-outlined">login</span> Login
            </Link>
          )}
        </li>
        <li className="nav-search">
          <SearchBar />
        </li>
      </ul>
      {showModal && <LogoutModal onClose={() => setShowModal(false)} />}
    </nav>
  );
};

export default Navbar;
