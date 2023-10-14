import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState, AppDispatch } from "../store";
import { getPost, updatePost, deletePost } from "../postSlice";
import { Helmet } from "react-helmet-async";
import {
  Editor,
  EditorState,
  convertToRaw,
  convertFromRaw,
  RichUtils,
} from "draft-js";
import useTextareaHeight from "../hooks/useTextareaHeight";
import categoriesList from "../utils/categoriesList";
import RichTextToolbar from "../components/RichTextToolbar";
import HeightAdjuster from "../components/HeightAdjuster";

const EditPostPage: React.FC = () => {
  const { id } = useParams();
  const post = useSelector((state: RootState) =>
    state.posts.posts.find((p) => p.id === id)
  );
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string | undefined>("");
  const [error, setError] = useState<string | null>(null);

  const titleRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { textareaHeight, increaseHeight, decreaseHeight } =
    useTextareaHeight(250);
  const [editorState, setEditorState] = useState(() =>
    post
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(post.content)))
      : EditorState.createEmpty()
  );

  useEffect(() => {
    if (!id) return;
    if (post) {
      setTitle(post.title);
      const contentState = convertFromRaw(JSON.parse(post.content));
      setEditorState(EditorState.createWithContent(contentState));
      setCategory(post.category);
    } else {
      dispatch(getPost(id));
    }
  }, [post, dispatch, id]);

  const onSavePostClicked = async () => {
    const contentRaw = editorState.getCurrentContent();
    const contentString = contentRaw.getPlainText();
    const serializedContent = JSON.stringify(convertToRaw(contentRaw));

    if (title.length < 30) {
      setError(
        `Title should be at least 30 symbols! You have ${
          title.length
        } symbols. Please add ${30 - title.length} more.`
      );
      titleRef.current?.focus();
      return;
    }
    if (!category) {
      setError("Please choose a category!");
      categoryRef.current?.focus();
      return;
    }
    if (contentString.length < 1000) {
      setError(
        `Content should be at least 1000 symbols! You have ${
          contentString.length
        } symbols. You need ${1000 - contentString.length} more symbols.`
      );
      return;
    }

    if (title && serializedContent && category && id) {
      await dispatch(
        updatePost({ id, title, content: serializedContent, category })
      );
      navigate(`/post/${id}`);
    }
  };

  const onDeletePostClicked = async () => {
    if (id) {
      await dispatch(deletePost(id));
      navigate("/");
    }
  };

  const handleKeyCommand = (command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
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
      <h2 className="heading">Edit Post</h2>
      <form>
        <div className="title-category-wrapper">
          <div className="title-wrapper">
            <label htmlFor="postTitle">Title:</label>
            <input
              type="text"
              id="postTitle"
              name="postTitle"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError(null);
              }}
              ref={titleRef}
            />
          </div>
          <div className="category-wrapper">
            <label htmlFor="postCategory">Category:</label>
            <select
              id="postCategory"
              name="postCategory"
              value={category || ""}
              onChange={(e) => {
                setCategory(e.target.value);
                setError(null);
              }}
              ref={categoryRef}
            >
              {categoriesList.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <RichTextToolbar
          editorState={editorState}
          setEditorState={setEditorState}
        />
        <div
          style={{
            height: `${textareaHeight}px`,
            overflow: "auto",
            marginBottom: "15px",
            transition: ".3s",
          }}
        >
          <Editor
            editorState={editorState}
            onChange={setEditorState}
            handleKeyCommand={handleKeyCommand}
          />
        </div>
        {error && <p className="error">⚠️ {error}</p>}
        <div className="button-wrapper">
          <button
            type="button"
            onClick={onSavePostClicked}
            className="btn green"
          >
            <span className="material-symbols-outlined">update</span>Update
          </button>
          <HeightAdjuster
            decreaseHeight={decreaseHeight}
            increaseHeight={increaseHeight}
          />
          <button
            type="button"
            onClick={onDeletePostClicked}
            className="btn red"
          >
            <span className="material-symbols-outlined">delete</span>Delete
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditPostPage;
