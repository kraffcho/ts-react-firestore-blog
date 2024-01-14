import React, { useState } from "react";
import CommentItem from "./CommentItem";
import { useLatestComments } from "../hooks/useLatestComments";

const LatestComments: React.FC = () => {
  const { latestComments, posts } = useLatestComments();
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(6);

  return (
    <div className="latest-comments animate__animated animate__fadeIn">
      <h2>
        <span className="material-symbols-outlined notranslate">comment</span> Latest
        Comments
      </h2>
      {latestComments.slice(0, visibleCommentsCount).map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postTitle={posts[comment.postId]?.title}
        />
      ))}
      {latestComments.length > visibleCommentsCount && (
        <button
          className="btn green extra-padding show-more-comments"
          onClick={() => setVisibleCommentsCount((prev) => prev + 4)}
        >
          Show More Comments
        </button>
      )}
    </div>
  );
};

export default LatestComments;
