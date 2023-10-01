import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPosts } from "../postSlice";
import { RootState, AppDispatch } from "../store";

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector((state: RootState) => state.posts.posts);
  const status = useSelector((state: RootState) => state.posts.status);
  const error = useSelector((state: RootState) => state.posts.error);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts());
    }
  }, [status, dispatch]);

  if (status === "loading") return <p className="loading animate__animated animate__fadeIn">Loading</p>;
  if (error) return <p>Error: {error}</p>;
  if (posts.length === 0) return null;

  return (
    <div className="container animate__animated animate__fadeIn">
      <h2>MicroBlog Posts</h2>
      <ul>
        {posts.map((post, index) => (
          <li
            key={post.id}
            className="animate__animated animate__zoomInUp"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {post.title ? (
              <Link to={`/post/${post.id}`}>{post.title}</Link>
            ) : (
              <p>Untitled Post</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
