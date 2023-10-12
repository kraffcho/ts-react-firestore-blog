import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import {
  getDocs,
  collection,
  where,
  query,
  updateDoc,
  doc,
  arrayRemove,
} from "firebase/firestore";
import { Post } from "../utils/types";
import { categoryNameToColor } from "../utils/categoriesColors";
import { formatDate } from "../utils/formatDate";

const SavedPage: React.FC = () => {
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchSavedPosts = async () => {
      if (!currentUser) return;

      const q = query(
        collection(db, "posts"),
        where("savedBy", "array-contains", currentUser.uid)
      );

      try {
        const querySnapshot = await getDocs(q);
        const fetchedPosts = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Post)
        );
        setSavedPosts(fetchedPosts);
      } catch (e) {
        console.error("Error fetching saved posts:", e);
      }
    };

    fetchSavedPosts();
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

  return (
    <div className="container saved-posts-wrapper animate__animated animate__fadeIn">
      <h1 className="saved-posts__header">Saved Posts</h1>
      <div className="saved-posts__list">
        {savedPosts.map((post) => (
          <div
            key={post.id}
            className="saved-posts__item animate__animated animate__fadeIn"
          >
            <div className="saved-posts__info">
              <Link
                to={`/post/${post.id}`}
                className="saved-posts__link"
                style={{ color: categoryNameToColor(post.category!) }}
              >
                {post.title}
              </Link>
              <p className="published">
                Published: {formatDate(post.publishedAt.toDate())} in{" "}
                {post.category}
              </p>
            </div>
            <button
              className="btn red"
              onClick={() => removeSavedPost(post.id)}
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        ))}
      </div>
      {!savedPosts.length && (
        <p className="saved-posts__empty-message">
          You have no saved posts. To add a post to your collection of saved
          posts, click the bookmark icon on the post.
        </p>
      )}
    </div>
  );
};

export default SavedPage;
