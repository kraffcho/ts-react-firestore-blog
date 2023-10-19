import React from "react";
import CommentItem from "./CommentItem";
import { useLatestComments } from "../hooks/useLatestComments";

const LatestComments: React.FC = () => {
  const { latestComments, posts } = useLatestComments();

  return (
    <div className="latest-comments animate__animated animate__fadeIn">
      <h2>
        <span className="material-symbols-outlined">comment</span> Latest
        Comments
      </h2>
      {latestComments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postTitle={posts[comment.postId]?.title}
        />
      ))}
    </div>
  );
};

export default LatestComments;
