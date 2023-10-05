import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addPost } from "../postSlice";
import { AppDispatch } from "../store";
import { Helmet } from "react-helmet-async";
import { Editor, EditorState, convertToRaw, RichUtils } from "draft-js";
import categoriesList from "../utils/categoriesList";
import useTextareaHeight from "../hooks/useTextareaHeight";

const AddPostPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [category, setCategory] = useState<string | undefined>("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { textareaHeight, increaseHeight, decreaseHeight } =
  useTextareaHeight(150);
  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);

  const onSavePostClicked = () => {
    const content = JSON.stringify(
      convertToRaw(editorState.getCurrentContent())
    );

    if (title && content && category) {
      dispatch(addPost({ title, content, category }));
      setTitle("");
      setEditorState(EditorState.createEmpty());
      setCategory(undefined);
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
        <title>Add New Post</title>
        <meta
          name="description"
          content="Add a new post to the blog. Choose a category, set a title, and write your content."
        />
      </Helmet>
      <h2 className="heading">Add a New Post</h2>
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
              {categoriesList.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="toolbar">
          <button
            type="button"
            onClick={() =>
              setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"))
            }
          >
            Bold
          </button>
          <button
            type="button"
            onClick={() =>
              setEditorState(RichUtils.toggleInlineStyle(editorState, "ITALIC"))
            }
          >
            Italic
          </button>
        </div>
        <label htmlFor="postContent">Content:</label>
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
        <div className="button-wrapper">
          <button
            type="button"
            onClick={onSavePostClicked}
            className="btn green"
          >
            Add Post
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
        </div>
      </form>
    </section>
  );
};

export default AddPostPage;
