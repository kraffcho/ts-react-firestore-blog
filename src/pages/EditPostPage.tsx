import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getPost, updatePost, deletePost } from "../redux/postSlice";
import { AppDispatch, RootState } from "../redux/store";
import { Helmet } from "react-helmet-async";
import { Editor } from "draft-js";
import { useEditorStateManagement } from "../hooks/useEditorStateManagement";
import useTextareaHeight from "../hooks/useTextareaHeight";
import categoriesList from "../utils/categoriesList";
import RichTextToolbar from "../components/RichTextToolbar";
import HeightAdjuster from "../components/HeightAdjuster";
import { getAuth } from "firebase/auth";

type EditPageProps = {
  userRoles: { [key: string]: string };
};

const EditPostPage: React.FC<EditPageProps> = ({ userRoles }) => {
  const { id } = useParams();
  const post = useSelector((state: RootState) =>
    state.posts.posts.find((p) => p.id === id)
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const currentUser = getAuth().currentUser;

  const { textareaHeight, increaseHeight, decreaseHeight } =
    useTextareaHeight(250);

  const {
    title,
    setTitle,
    editorState,
    setEditorState,
    category,
    setCategory,
    handleKeyCommand,
    validateAndSerializeContent,
  } = useEditorStateManagement({ postContent: post?.content });

  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) navigate("/login");
  }, [currentUser, navigate]);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setCategory(post.category);
    } else if (id) {
      dispatch(getPost(id));
    }
  }, [post, dispatch, id, setTitle, setCategory]);

  const isValidForm = () => {
    const result = validateAndSerializeContent();
    if (
      title &&
      category &&
      id &&
      !result.startsWith("Title should") &&
      !result.startsWith("Please choose") &&
      !result.startsWith("Content should")
    ) {
      return true;
    }
    setLocalError(result);
    return false;
  };

  const onSavePostClicked = async () => {
    if (isValidForm()) {
      if (id && title && category) {
        await dispatch(
          updatePost({
            id,
            title,
            content: validateAndSerializeContent(),
            category,
          })
        );
        navigate(`/post/${id}`);
      } else {
        setLocalError("Required fields are missing");
      }
    }
  };

  const onDeletePostClicked = async () => {
    if (id) {
      await dispatch(deletePost(id));
      navigate("/");
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setLocalError(null);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setLocalError(null);
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
              onChange={handleTitleChange}
            />
          </div>
          <div className="category-wrapper">
            <label htmlFor="postCategory">Category:</label>
            <select
              id="postCategory"
              name="postCategory"
              value={category || ""}
              onChange={handleCategoryChange}
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
            <span className="material-symbols-outlined notranslate">update</span>Update
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
            <span className="material-symbols-outlined notranslate">delete</span>Delete
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditPostPage;
