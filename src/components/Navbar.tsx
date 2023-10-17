import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import LogoutModal from "./LogoutModal";
import useScrollFade from "../hooks/useScrollFade";

type NavbarProps = {
  user: any | null;
  userRoles: { [key: string]: string };
};

const Navbar: React.FC<NavbarProps> = ({ user, userRoles }) => {
  const [showModal, setShowModal] = useState(false);
  const isNavbarFaded = useScrollFade(200);

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

  const canAddPost = () => {
    if (!user || !user.uid) return false;
    const role = userRoles[user.uid];
    return role === "admin" || role === "writer";
  };

  return (
    <>
      <nav
        className={`nav-container${
          !isNavbarFaded
            ? " animate__animated animate__fadeInDown"
            : " animate__animated animate__fadeOutUp"
        }`}
      >
        <div className="nav-wrapper">
          <ul className="nav-container">
            <li className="nav-link">
              <Link to="/">
                <span className="material-symbols-outlined">house</span>
                <span className="link-text">Posts</span>
              </Link>
            </li>
            {user && (
              <>
                <li className="nav-link">
                  <Link to="/saved">
                    <span className="material-symbols-outlined">
                      bookmark_added
                    </span>
                    <span className="link-text">Saved</span>
                  </Link>
                </li>
                {canAddPost() && (
                  <li className="nav-link">
                    <Link to="/add-post">
                      <span className="material-symbols-outlined">
                        post_add
                      </span>
                      <span className="link-text">Add Post</span>
                    </Link>
                  </li>
                )}
              </>
            )}
            <li className="nav-link">
              {user ? (
                <Link to="" onClick={handleLogout}>
                  <span className="material-symbols-outlined">logout</span>
                  <span className="link-text">Logout</span>
                </Link>
              ) : (
                <Link to="/login">
                  <span className="material-symbols-outlined">login</span>
                  <span className="link-text">Login</span>
                </Link>
              )}
            </li>
          </ul>
          <SearchBar />
        </div>
      </nav>
      {showModal && <LogoutModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default Navbar;
