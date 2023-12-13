import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import Notification from "./Notification";

type BookmarkToggleProps = {
  postId: string;
  isInitiallyBookmarked?: boolean;
};

const BookmarkToggle: React.FC<BookmarkToggleProps> = ({
  postId,
  isInitiallyBookmarked = false,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(isInitiallyBookmarked);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [notificationKey, setNotificationKey] = useState<number>(0);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  const toggleBookmark = async () => {
    if (!currentUser) {
      console.error("User not authenticated");
      return;
    }

    setLoading(true);

    try {
      const postRef = doc(db, "posts", postId);
      if (isBookmarked) {
        await updateDoc(postRef, {
          savedBy: arrayRemove(currentUser.uid),
        });
        setIsBookmarked(false);
        setNotificationMessage("Removed from Saved");
      } else {
        await updateDoc(postRef, {
          savedBy: arrayUnion(currentUser.uid),
        });
        setIsBookmarked(true);
        setNotificationMessage("Added to Saved");
      }
      setNotificationKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Error updating bookmark:", error);
      setNotificationMessage("Error updating bookmark. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div onClick={!loading ? toggleBookmark : undefined} className="bookmark">
        {loading ? (
          <span className="material-symbols-outlined notranslate">bookmark</span>
        ) : isBookmarked ? (
          <span className="material-symbols-outlined notranslate added">
            bookmark_added
          </span>
        ) : (
          <span className="material-symbols-outlined notranslate">bookmark</span>
        )}
      </div>
      {notificationMessage && (
        <Notification
          key={notificationKey}
          classes="animate__animated animate__hinge animate__delay-1s"
          message={notificationMessage}
          time={3000}
        />
      )}
    </>
  );
};

export default BookmarkToggle;
