import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState, AppDispatch } from "../store";
import { getPost, updatePost, deletePost } from "../postSlice";

const EditPostPage: React.FC = () => {
  const { id } = useParams();
  const post = useSelector((state: RootState) =>
    state.posts.posts.find((p) => p.id === id)
  );
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [textareaHeight, setTextareaHeight] = useState("150px"); // Initial height
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    } else {
      dispatch(getPost(id));
    }
  }, [post, dispatch, id]);

  const onSavePostClicked = async () => {
    if (title && content && id) {
      await dispatch(updatePost({ id, title, content }));
      navigate(`/post/${id}`);
    }
  };

  const onDeletePostClicked = async () => {
    if (id) {
      await dispatch(deletePost(id));
      navigate("/");
    }
  };

  const increaseHeight = () => {
    setTextareaHeight((prevHeight) => {
      const newHeight = parseInt(prevHeight) * 1.5;
      return newHeight + "px";
    });
  };

  const decreaseHeight = () => {
    setTextareaHeight((prevHeight) => {
      const newHeight = parseInt(prevHeight) / 1.5;
      return newHeight + "px";
    });
  };

  return (
    <section className="container animate__animated animate__fadeIn">
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ height: textareaHeight }}
        />
        <div className="button-wrapper">
          <button
            type="button"
            onClick={onSavePostClicked}
            className="btn green"
          >
            Update Post
          </button>
          <div className="increase-height">
            <button
              type="button"
              onClick={increaseHeight}
              className="btn yellow"
            >
              +
            </button>
            <button
              type="button"
              onClick={decreaseHeight}
              className="btn yellow"
            >
              -
            </button>
          </div>
          <button
            type="button"
            onClick={onDeletePostClicked}
            className="btn red"
          >
            Delete Post
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditPostPage;
