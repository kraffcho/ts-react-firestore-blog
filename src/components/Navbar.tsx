import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

type NavbarProps = {
  user: any | null;
};

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const handleLogout = (event: React.MouseEvent) => {
    event.preventDefault();
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("Logged out successfully");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <nav>
      <ul className="nav-container">
        <li className="nav-link">
          <Link to="/">Home</Link>
        </li>
        {user && (
          <li className="nav-link">
            <Link to="/add-post">Add Post</Link>
          </li>
        )}
        <li className="nav-link">
          {user ? (
            <Link to="" onClick={handleLogout}>
              Log Out
            </Link>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </li>
        <li className="nav-search">
          <SearchBar />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
