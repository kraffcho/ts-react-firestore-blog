import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addPost } from "../postSlice";
import { AppDispatch } from "../store";
import { Helmet } from "react-helmet-async";
import { Editor, EditorState, convertToRaw, RichUtils } from "draft-js";
import categoriesList from "../utils/categoriesList";
import useTextareaHeight from "../hooks/useTextareaHeight";
import RichTextToolbar from "../components/RichTextToolbar";
import HeightAdjuster from "../components/HeightAdjuster";

const AddPostPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [category, setCategory] = useState<string | undefined>("");
  const [error, setError] = useState<string | null>(null);

  const titleRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { textareaHeight, increaseHeight, decreaseHeight } =
    useTextareaHeight(250);

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setError(null); // clear the error when user starts typing again
  };

  const onSavePostClicked = () => {
    const contentRaw = editorState.getCurrentContent();
    const contentString = contentRaw.getPlainText();
    const serializedContent = JSON.stringify(convertToRaw(contentRaw));

    if (title.length < 30) {
      setError(`Title should be at least 30 symbols! You have ${title.length} symbols. Please add ${30 - title.length} more.`);
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

    dispatch(addPost({ title, content: serializedContent, category }));
    setTitle("");
    setEditorState(EditorState.createEmpty());
    setCategory(undefined);
    navigate("/");
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
          <Editor editorState={editorState} onChange={setEditorState} handleKeyCommand={handleKeyCommand} />
        </div>
        {error && <p className="error">⚠️ {error}</p>}
        <div className="button-wrapper">
          <button
            type="button"
            onClick={onSavePostClicked}
            className="btn green"
          >
            <span className="material-symbols-outlined">add</span> Add Post
          </button>
          <HeightAdjuster
            decreaseHeight={decreaseHeight}
            increaseHeight={increaseHeight}
          />
        </div>
      </form>
    </section>
  );
};

export default AddPostPage;
