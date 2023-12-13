import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { fetchSavedPosts } from "../utils/api";
import { updateDoc, doc, arrayRemove } from "firebase/firestore";
import { Post } from "../utils/types";
import { categoryNameToColor } from "../utils/categoriesColors";
import { formatDate } from "../utils/formatDate";
import { db } from "../firebase";
import Cookies from "js-cookie";
import { Helmet } from "react-helmet-async";

const SavedSummary: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <p className="saved-posts__summary animate__animated animate__fadeIn">
    Monitor the articles you've bookmarked, whether for future reading or for
    convenient access. Use the bookmark symbol on an article to add it to your
    list. If you wish to unsave an article, click on the trash bin symbol or
    simply toggle the bookmark symbol on an already saved article.
    <button onClick={onClose} className="btn yellow">
      OK, GOT IT!
    </button>
  </p>
);

type SavedPostItemProps = {
  post: Post;
  onRemove: (id: string) => void;
  getLinkStyle: (category?: string | null) => { color: string };
};

const SavedPostItem: React.FC<SavedPostItemProps> = ({
  post,
  onRemove,
  getLinkStyle,
}) => (
  <div className="saved-posts__item">
    <div className="saved-posts__info">
      <Link to={`/post/${post.id}`} style={getLinkStyle(post.category)}>
        {post.title}
      </Link>
      <p className="published">
        Published: {formatDate(post.publishedAt.toDate())} in{" "}
        <Link
          to={`/category/${post.category}`}
          style={getLinkStyle(post.category)}
        >
          {post.category ?? "Uncategorized"}
        </Link>
      </p>
    </div>
    <button
      className="btn red"
      onClick={() => onRemove(post.id)}
      aria-label="Delete saved post"
    >
      <span className="material-symbols-outlined notranslate">delete</span>
    </button>
  </div>
);

const SavedPage: React.FC = () => {
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [shouldShowSummary, setShouldShowSummary] = useState<boolean>(
    !Cookies.get("hideSummary")
  );

  const auth = getAuth();
  const { currentUser } = auth;

  const getLinkStyle = useCallback(
    (category?: string | null) => ({
      color: category ? categoryNameToColor(category) : "#333",
    }),
    []
  );

  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);

    fetchSavedPosts(currentUser.uid)
      .then((fetchedPosts) => setSavedPosts(fetchedPosts))
      .catch((e) => {
        console.error("Error fetching saved posts:", e);
        setError("Failed to load saved posts.");
      })
      .finally(() => setLoading(false));
  }, [currentUser]);

  const removeSavedPost = useCallback(
    async (postId: string) => {
      if (!currentUser) return;

      const postRef = doc(db, "posts", postId);
      try {
        await updateDoc(postRef, { savedBy: arrayRemove(currentUser.uid) });
        setSavedPosts((prev) => prev.filter((post) => post.id !== postId));
      } catch (e) {
        console.error("Error removing saved post:", e);
      }
    },
    [currentUser]
  );

  const handleCloseSummary = () => {
    Cookies.set("hideSummary", "true", { expires: 365 });
    setShouldShowSummary(false);
  }

  return (
    <div className="container saved-posts-wrapper animate__animated animate__fadeIn">
      <Helmet>
        <title>Saved Posts Dashboard</title>
        <meta
          name="description"
          content="Monitor and manage bookmarked articles for easy access. Add new ones or remove existing ones with simple toggles and actions."
        />
      </Helmet>
      <h1 className="saved-posts__header">Saved Posts ({savedPosts.length})</h1>

      {shouldShowSummary && <SavedSummary onClose={handleCloseSummary} />}

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Dusting off your treasured posts... 📚</p>
      ) : savedPosts.length === 0 ? (
        <p className="saved-posts__empty-message">
          <strong>You have no saved posts.</strong> To add a post to your
          collection of saved posts, click the bookmark icon on the post.
        </p>
      ) : (
        <>
          <div className="saved-posts__list animate__animated animate__fadeIn">
            {savedPosts.map((post) => (
              <SavedPostItem
                key={post.id}
                post={post}
                onRemove={removeSavedPost}
                getLinkStyle={getLinkStyle}
              />
            ))}
            <span>
              You have a total of {savedPosts.length} saved{" "}
              {savedPosts.length > 1 ? "posts" : "post"}.
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default SavedPage;
