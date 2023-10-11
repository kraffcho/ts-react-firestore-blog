import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

type BookmarkToggleProps = {
  postId: string;
  isInitiallyBookmarked?: boolean;
};

const BookmarkToggle: React.FC<BookmarkToggleProps> = ({
  postId,
  isInitiallyBookmarked = false,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(isInitiallyBookmarked);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    setIsBookmarked(isInitiallyBookmarked);
  }, [isInitiallyBookmarked]);

  const toggleBookmark = async () => {
    if (!currentUser) {
      console.error("User not authenticated");
      return;
    }

    try {
      const postRef = doc(db, "posts", postId);
      if (isBookmarked) {
        await updateDoc(postRef, {
          savedBy: arrayRemove(currentUser.uid),
        });
      } else {
        await updateDoc(postRef, {
          savedBy: arrayUnion(currentUser.uid),
        });
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error("Error updating bookmark:", error);
    }
  };

  return (
    <div onClick={toggleBookmark} className="bookmark">
      {isBookmarked ? (
        <span className="material-symbols-outlined added">bookmark_added</span>
      ) : (
        <span className="material-symbols-outlined">bookmark</span>
      )}
    </div>
  );
};

export default BookmarkToggle;
