import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Editor, EditorState, RichUtils } from "draft-js";
import { getAuth } from "firebase/auth";
import { AppDispatch } from "../redux/store";
import { addPost } from "../redux/postSlice";
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
    validateAndSerializeContent,
  } = useEditorStateManagement();

  const [localError, setLocalError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { textareaHeight, increaseHeight, decreaseHeight } =
    useTextareaHeight(250);

  const user = getAuth().currentUser;
  const userId = user ? user.uid : null;
  const titleRef = useRef<HTMLInputElement | null>(null);
  const categoryRef = useRef<HTMLSelectElement | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validateFormData = () => {
    const result = validateAndSerializeContent();
    if (!userId) return "User not logged in";
    if (result.startsWith("Title should")) return result;
    if (result.startsWith("Please choose")) return result;
    if (result.startsWith("Content should")) return result;
    if (!category) return "Please select a category";
    return null;
  };

  const onSavePostClicked = () => {
    const validationResult = validateFormData();

    if (!userId) {
      setLocalError("User not logged in");
      return;
    }

    if (!validationResult) {
      const payload = {
        title,
        content: validateAndSerializeContent(),
        category: category || "",
        userId,
      };

      dispatch(addPost(payload));
      setTitle("");
      setEditorState(EditorState.createEmpty());
      setCategory(undefined);
      navigate("/");
    } else {
      setLocalError(validationResult);
    }
  };

  const handleKeyCommand = (
    command: string,
    editorState: EditorState
  ): "handled" | "not-handled" => {
    let newState;

    switch (command) {
      case "bold":
        newState = RichUtils.toggleInlineStyle(editorState, "BOLD");
        break;
      case "italic":
        newState = RichUtils.toggleInlineStyle(editorState, "ITALIC");
        break;
      case "underline":
        newState = RichUtils.toggleInlineStyle(editorState, "UNDERLINE");
        break;
      default:
        return "not-handled";
    }

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
            handleKeyCommand={(command) =>
              handleKeyCommand(command, editorState)
            }
          />
        </div>
        {localError && (
          <p className="error animate__animated animate__fadeIn">
            ⚠️ {localError}
          </p>
        )}
        <div className="button-wrapper">
          <button
            type="button"
            onClick={onSavePostClicked}
            className="btn green"
          >
            <span className="material-symbols-outlined notranslate">add</span> Add Post
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
