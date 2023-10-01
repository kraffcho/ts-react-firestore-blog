import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // useNavigate replaces useHistory in v6
import { addPost } from "../postSlice";
import { AppDispatch } from "../store";

const AddPostPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate(); // Initializing useNavigate

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const onContentChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setContent(e.target.value);

  const onSavePostClicked = () => {
    if (title && content) {
      dispatch(addPost({ title, content }));
      setTitle("");
      setContent("");
      navigate("/"); // Using navigate to go to the home page
    }
  };

  return (
    <section className="container animate__animated animate__fadeIn">
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onSavePostClicked}>
          Add Post
        </button>
      </form>
    </section>
  );
};

export default AddPostPage;
