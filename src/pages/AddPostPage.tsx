import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addPost } from "../postSlice";
import { AppDispatch } from "../store";

const AddPostPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<string | undefined>("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const onContentChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setContent(e.target.value);

  const onSavePostClicked = () => {
    if (title && content && category) {
      dispatch(addPost({ title, content, category }));
      setTitle("");
      setContent("");
      setCategory(undefined);
      navigate("/");
    }
  };

  return (
    <section className="container animate__animated animate__fadeIn">
      <h2>Add a New Post</h2>
      <form>
        <div className="title-category-wrapper">
          <div className="title-wrapper">
            <label htmlFor="postTitle">Post Title:</label>
            <input
              type="text"
              id="postTitle"
              name="postTitle"
              value={title}
              onChange={onTitleChanged}
            />
          </div>
          <div className="category-wrapper">
            <label htmlFor="postCategory">Category:</label>
            <select
              id="postCategory"
              name="postCategory"
              value={category || ""}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select a category...</option>
              <option value="tech">Tech</option>
              <option value="life">Life</option>
              <option value="funny">Funny</option>
              <option value="others">Others</option>
            </select>
          </div>
        </div>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <div className="button-wrapper">
          <button
            type="button"
            onClick={onSavePostClicked}
            className="btn green"
          >
            Add Post
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddPostPage;
