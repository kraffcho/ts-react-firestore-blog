import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState, AppDispatch } from "../store";
import { getPost, updatePost } from "../postSlice";

const EditPostPage: React.FC = () => {
  const { id } = useParams();
  const post = useSelector((state: RootState) =>
    state.posts.posts.find((p) => p.id === id)
  );
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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
        />
        <button type="button" onClick={onSavePostClicked}>
          Update Post
        </button>
      </form>
    </section>
  );
};

export default EditPostPage;
