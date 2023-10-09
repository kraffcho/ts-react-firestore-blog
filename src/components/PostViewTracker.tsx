import React, { useEffect } from "react";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";

interface Props {
  postId: string;
}

const PostViewTracker: React.FC<Props> = ({ postId }) => {
  useEffect(() => {
    const postViews = localStorage.getItem("postViews");
    let viewedPosts = postViews ? JSON.parse(postViews) : [];

    if (!viewedPosts.includes(postId)) {
      // Increment view count in firestore
      const postRef = doc(db, "posts", postId);
      updateDoc(postRef, {
        viewCount: increment(1),
      });

      // Save to local storage
      viewedPosts.push(postId);
      localStorage.setItem("postViews", JSON.stringify(viewedPosts));
    }
  }, [postId]);

  return null; // It doesn't render anything
};

export default PostViewTracker;
