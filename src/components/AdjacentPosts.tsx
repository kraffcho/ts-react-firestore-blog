import React from "react";
import { Link } from "react-router-dom";
import { Post } from "../utils/types";

interface Props {
  currentPostId: string;
  allPosts: Post[];
}

const AdjacentPosts: React.FC<Props> = ({ currentPostId, allPosts }) => {
  const currentIndex = allPosts.findIndex((post) => post.id === currentPostId);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <div className="adjacent-posts">
      {prevPost && (
        <Link to={`/post/${prevPost.id}`} className="prev-post">
          <span className="dark">Previous Post:</span>
          <br />
          {prevPost.title}
        </Link>
      )}
      {nextPost && (
        <Link to={`/post/${nextPost.id}`} className="next-post">
          <span className="dark">Read Next:</span>
          <br />
          {nextPost.title}
        </Link>
      )}
    </div>
  );
};

export default AdjacentPosts;
