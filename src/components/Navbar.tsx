import React from "react";
import { Link } from "react-router-dom"; // Importing Link component from react-router-dom v6

const Navbar: React.FC = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/add-post">Add Post</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
