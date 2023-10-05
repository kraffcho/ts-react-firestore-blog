// Navbar.tsx

import React from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

const Navbar: React.FC = () => {
  return (
    <nav>
      <ul className="nav-container">
        <li className="nav-link">
          <Link to="/">Home</Link>
        </li>
        <li className="nav-link">
          <Link to="/add-post">Add Post</Link>
        </li>
        <li className="nav-link">
          <Link to="/">Logout</Link>
        </li>
        <li className="nav-search">
          <SearchBar />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
