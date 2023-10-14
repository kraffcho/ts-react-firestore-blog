import React, { useState } from "react";
import { AppDispatch } from "../store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addPost } from "../postSlice";
import { Helmet } from "react-helmet-async";
import { Editor, EditorState } from "draft-js";
import { useEditorStateManagement } from "../hooks/useEditorStateManagement";
import categoriesList from "../utils/categoriesList";
import useTextareaHeight from "../hooks/useTextareaHeight";
import RichTextToolbar from "../components/RichTextToolbar";
import HeightAdjuster from "../components/HeightAdjuster";

const AddPostPage: React.FC = () => {
  const {
    title,
    setTitle,
    editorState,
    setEditorState,
    category,
    setCategory,
    titleRef,
    categoryRef,
    handleKeyCommand,
    validateAndSerializeContent,
  } = useEditorStateManagement();

  const [localError, setLocalError] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { textareaHeight, increaseHeight, decreaseHeight } =
    useTextareaHeight(250);

  const onSavePostClicked = () => {
    const result = validateAndSerializeContent();

    if (
      result &&
      !result.startsWith("Title should") &&
      !result.startsWith("Please choose") &&
      !result.startsWith("Content should") &&
      category
    ) {
      dispatch(addPost({ title, content: result, category }));
      setTitle("");
      setEditorState(EditorState.createEmpty());
      setCategory(undefined);
      navigate("/");
    } else {
      setLocalError(result);
    }
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
              onChange={(e) => setTitle(e.target.value)}
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
        {localError && <p className="error">⚠️ {localError}</p>}
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
