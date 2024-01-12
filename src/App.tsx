import React, { useState, useEffect, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ReadingProgressBar from "./components/ReadingProgressBar";
import {
  getAuth,
  browserLocalPersistence,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import fetchUserRoles from "./utils/fetchUserRoles";
import { UserRoles } from "./utils/types";
import "./App.scss";

const HomePage = lazy(() => import("./pages/HomePage"));
const AddPostPage = lazy(() => import("./pages/AddPostPage"));
const EditPostPage = lazy(() => import("./pages/EditPostPage"));
const PostPage = lazy(() => import("./pages/PostPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const SavedPage = lazy(() => import("./pages/SavedPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<UserRoles>({});

  useEffect(() => {
    const auth = getAuth();
    auth.setPersistence(browserLocalPersistence);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const roles = await fetchUserRoles();
      if (currentUser) {
        setIsAuthenticated(true);
        setUser(currentUser);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setUserRoles(roles);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const canAddPosts = (): boolean => {
    const role = userRoles[user?.uid || ""];
    return role === "admin" || role === "writer";
  };

  return { isAuthenticated, user, loading, userRoles, canAddPosts };
}

function AppRoutes(props: any) {
  const { isAuthenticated, user, userRoles, canAddPosts } = props;

  return (
    <Suspense fallback={<p className="loading">Loading</p>}>
      <Routes>
        <Route
          path="/"
          element={<HomePage user={user} userRoles={userRoles} />}
        />
        <Route
          path="/category/:categoryName"
          element={<HomePage user={user} userRoles={userRoles} />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />}
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
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  const auth = useAuth();

  if (auth.loading) return <p className="loading">Loading</p>;

  return (
    <Router>
      <Navbar user={auth.user} userRoles={auth.userRoles} />
      <AppRoutes {...auth} />
      <Footer />
      <ScrollToTop />
    </Router>
  );
}

export default App;
