import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AddPostPage from "./pages/AddPostPage";
import EditPostPage from "./pages/EditPostPage";
import PostPage from "./pages/PostPage";
import LoginPage from "./pages/LoginPage";
import Footer from "./components/Footer";
import { getAuth, browserLocalPersistence, onAuthStateChanged } from "firebase/auth";
import { User } from "firebase/auth";
import "./App.scss";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    auth.setPersistence(browserLocalPersistence);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setIsAuthenticated(true);
        setUser(currentUser);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:categoryName" element={<HomePage />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="/add-post"
          element={isAuthenticated ? <AddPostPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/edit-post/:id"
          element={
            isAuthenticated ? <EditPostPage /> : <Navigate to="/login" />
          }
        />
        <Route path="/post/:id" element={<PostPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
