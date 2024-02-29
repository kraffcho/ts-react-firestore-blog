import React, { useState } from "react";
import { Link } from "react-router-dom";
import { handleLogout } from "../utils/auth";
import LogoutModal from "./LogoutModal";
import SearchBar from "./SearchBar";
import useScrollFade from "../hooks/useScrollFade";

type NavbarProps = {
  user: any | null;
  userRoles: { [key: string]: string };
};

const Navbar: React.FC<NavbarProps> = ({ user, userRoles }) => {
  const [showModal, setShowModal] = useState(false);
  const isNavbarFaded = useScrollFade(400);

  const logoutHandler = (event: React.MouseEvent) => {
    event.preventDefault();
    handleLogout(
      () => setShowModal(true),
      (error) => console.error("Error logging out:", error)
    );
  };

  const canAddPost = () => {
    if (!user || !user.uid) return false;
    const role = userRoles[user.uid];
    return role === "admin" || role === "writer";
  };

  return (
    <>
      <header
        className={`header-container${!isNavbarFaded
          ? " animate__animated animate__fadeInDown"
          : " animate__animated animate__fadeOutUp"
          }`}
      >
        <nav className="nav-wrapper">
          <ul className="nav-container">
            <li className="nav-link">
              <Link to="/">
                <span className="material-symbols-outlined notranslate">house</span>
                <span className="link-text">Home</span>
              </Link>
            </li>
            <li className="nav-link">
              <Link to="/projects">
                <span className="material-symbols-outlined notranslate">
                  engineering
                </span>
                <span className="link-text">Projects</span>
              </Link>
            </li>
            {user && (
              <>
                <li className="nav-link">
                  <Link to="/saved">
                    <span className="material-symbols-outlined notranslate">
                      bookmark_added
                    </span>
                    <span className="link-text">Saved</span>
                  </Link>
                </li>
                {canAddPost() && (
                  <li className="nav-link">
                    <Link to="/add-post">
                      <span className="material-symbols-outlined notranslate">
                        post_add
                      </span>
                      <span className="link-text">Publish</span>
                    </Link>
                  </li>
                )}
              </>
            )}
            <li className="nav-link">
              {user ? (
                <Link to="" onClick={logoutHandler}>
                  <span className="material-symbols-outlined notranslate">logout</span>
                  <span className="link-text">Logout</span>
                </Link>
              ) : (
                <Link to="/login">
                  <span className="material-symbols-outlined notranslate">login</span>
                  <span className="link-text">Login</span>
                </Link>
              )}
            </li>
          </ul>
          <SearchBar />
        </nav>
      </header>
      {showModal && <LogoutModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default Navbar;
