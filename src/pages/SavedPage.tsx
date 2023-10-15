import React, { useEffect, useState } from "react";
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

const SavedPage: React.FC = () => {
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showSummary, setShowSummary] = useState<boolean>(
    !Cookies.get("hideSummary")
  );

  const auth = getAuth();
  const currentUser = auth.currentUser;

  const getLinkStyle = (category?: string | null) => ({
    color: category ? categoryNameToColor(category) : "#333",
  });

  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);

    fetchSavedPosts(currentUser.uid)
      .then((fetchedPosts) => {
        setSavedPosts(fetchedPosts);
      })
      .catch((e) => {
        console.error("Error fetching saved posts:", e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentUser]);

  const removeSavedPost = async (postId: string) => {
    if (!currentUser) return;

    const postRef = doc(db, "posts", postId);
    try {
      await updateDoc(postRef, {
        savedBy: arrayRemove(currentUser.uid),
      });
      setSavedPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (e) {
      console.error("Error removing saved post:", e);
    }
  };

  const handleCloseSummary = () => {
    setShowSummary(false);
    Cookies.set("hideSummary", "true", { expires: 365 });
  };

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
      {showSummary && (
        <p className="saved-posts__summary animate__animated animate__fadeIn">
          Monitor the articles you've bookmarked, whether for future reading or
          for convenient access. Use the bookmark symbol on an article to add it
          to your list. If you wish to unsave an article, click on the trash bin
          symbol or simply toggle the bookmark symbol on an already saved
          article.
          <button onClick={handleCloseSummary} className="btn yellow">
            Close this tip!
          </button>
        </p>
      )}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="saved-posts__list animate__animated animate__fadeIn">
            {savedPosts.map((post) => (
              <div key={post.id} className="saved-posts__item">
                <div className="saved-posts__info">
                  <Link
                    to={`/post/${post.id}`}
                    className="saved-posts__link"
                    style={getLinkStyle(post.category || null)}
                  >
                    {post.title}
                  </Link>
                  <p className="published">
                    Published: {formatDate(post.publishedAt.toDate())} in{" "}
                    <Link
                      to={`/category/${post.category}`}
                      style={getLinkStyle(post.category || null)}
                    >
                      {post.category ?? "Uncategorized"}
                    </Link>
                  </p>
                </div>
                <button
                  className="btn red"
                  onClick={() => removeSavedPost(post.id)}
                  aria-label="Delete saved post"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            ))}
            {savedPosts.length > 0 && (
              <span>
                You have a total of {savedPosts.length} saved{" "}
                {savedPosts.length > 1 ? "posts" : "post"}.
              </span>
            )}
          </div>
          {!savedPosts.length && (
            <p className="saved-posts__empty-message">
              <strong>You have no saved posts.</strong> To add a post to your
              collection of saved posts, click the bookmark icon on the post.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default SavedPage;
