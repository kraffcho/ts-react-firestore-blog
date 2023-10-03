import React from "react";
import { Link } from "react-router-dom";
import { Post } from "../utils/types";

interface Props {
  currentPostId: string;
  allPosts: Post[];
}

const AdjacentPosts: React.FC<Props> = ({ currentPostId, allPosts }) => {
  const sortedPosts = [...allPosts].sort(
    (a, b) =>
      a.publishedAt.toDate().getTime() - b.publishedAt.toDate().getTime()
  );

  const currentIndex = sortedPosts.findIndex(
    (post) => post.id === currentPostId
  );

  const prevPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < sortedPosts.length - 1
      ? sortedPosts[currentIndex + 1]
      : null;

  return (
    <div className="adjacent-posts">
      {prevPost && (
        <Link
          to={`/post/${prevPost.id}`}
          className="prev-post animate__animated animate__fadeInDown"
        >
          <span className="next-prev-title">Previous Post:</span>
          <br />
          {prevPost.title}
        </Link>
      )}
      {nextPost && (
        <Link
          to={`/post/${nextPost.id}`}
          className="next-post animate__animated animate__fadeInDown"
        >
          <span className="next-prev-title">Read Next:</span>
          <br />
          {nextPost.title}
        </Link>
      )}
    </div>
  );
};

export default AdjacentPosts;
