import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AddPostPage from "./pages/AddPostPage";
import EditPostPage from "./pages/EditPostPage";
import PostPage from "./pages/PostPage";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add-post" element={<AddPostPage />} />
        <Route path="/edit-post/:id" element={<EditPostPage />} />{" "}
        <Route path="/post/:id" element={<PostPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
