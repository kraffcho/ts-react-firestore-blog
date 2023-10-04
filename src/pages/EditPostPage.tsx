import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState, AppDispatch } from "../store";
import { getPost, updatePost, deletePost } from "../postSlice";
import { Helmet } from "react-helmet-async";
import categoriesList from "../utils/categoriesList";
import ReadingTime from "../components/ReadingTime";

const MIN_HEIGHT = 160;
const HEIGHT_INCREMENT = 100;

const EditPostPage: React.FC = () => {
  const { id } = useParams();
  const post = useSelector((state: RootState) =>
    state.posts.posts.find((p) => p.id === id)
  );
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<string | undefined>("");
  const [textareaHeight, setTextareaHeight] = useState(MIN_HEIGHT);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setCategory(post.category);
    } else {
      dispatch(getPost(id));
    }
  }, [post, dispatch, id]);

  const onSavePostClicked = async () => {
    if (title && content && category && id) {
      await dispatch(updatePost({ id, title, content, category }));
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
    setTextareaHeight((prevHeight) => prevHeight + HEIGHT_INCREMENT);
  };

  const decreaseHeight = () => {
    setTextareaHeight((prevHeight) =>
      Math.max(prevHeight - HEIGHT_INCREMENT, MIN_HEIGHT)
    );
  };

  return (
    <section className="container animate__animated animate__fadeIn">
      <Helmet>
        <title>Edit Post</title>
        <meta
          name="description"
          content="Edit an existing post. Modify the category, adjust the title, and update your content."
        />
      </Helmet>
      <h2>Edit Post</h2>
      <form>
        <div className="title-category-wrapper">
          <div className="title-wrapper">
            <label htmlFor="postTitle">Title:</label>
            <input
              type="text"
              id="postTitle"
              name="postTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              {categoriesList.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <label htmlFor="postContent">
          Content: <ReadingTime content={content} />
        </label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ height: `${textareaHeight}px` }}
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
