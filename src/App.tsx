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
import SavedPage from "./pages/SavedPage";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ReadingProgressBar from "./components/ReadingProgressBar";
import {
  getAuth,
  browserLocalPersistence,
  onAuthStateChanged,
} from "firebase/auth";
import fetchUserRoles from "./utils/fetchUserRoles";
import { User } from "firebase/auth";
import { UserRoles } from "./utils/types";
import "./App.scss";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<UserRoles>({});

  useEffect(() => {
    const auth = getAuth();
    auth.setPersistence(browserLocalPersistence);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setIsAuthenticated(true);
        setUser(currentUser);
        const roles = await fetchUserRoles();
        setUserRoles(roles);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setUserRoles({});
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const canAddPosts = (): boolean => {
    const role = userRoles[user?.uid || ""];
    return role === "admin" || role === "writer";
  };

  if (loading) return <p className="loading">Loading</p>;

  return (
    <Router>
      <Navbar user={user} userRoles={userRoles} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:categoryName" element={<HomePage />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="/add-post"
          element={
            isAuthenticated && canAddPosts() ? (
              <AddPostPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/edit-post/:id"
          element={
            isAuthenticated ? (
              <EditPostPage userRoles={userRoles} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/post/:id"
          element={
            <>
              <ReadingProgressBar />
              <PostPage userRoles={userRoles} />
            </>
          }
        />
        <Route
          path="/saved"
          element={isAuthenticated ? <SavedPage /> : <Navigate to="/login" />}
        />
      </Routes>
      <Footer />
      <ScrollToTop />
    </Router>
  );
}

export default App;
