import React from "react";
import { Link } from "react-router-dom";
import { Post } from "../utils/types";
import { categoryNameToColor } from "../utils/categoriesColors";

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
          className="prev-post animate__animated animate__fadeIn"
        >
          <span className="next-prev-title">Previous Post:</span>
          <span style={{ color: categoryNameToColor(prevPost.category!) }}>
            {prevPost.title}
          </span>
        </Link>
      )}
      {nextPost && (
        <Link
          to={`/post/${nextPost.id}`}
          className="next-post animate__animated animate__fadeIn"
        >
          <span className="next-prev-title">Read Next:</span>
          <span style={{ color: categoryNameToColor(nextPost.category!) }}>
            {nextPost.title}
          </span>
        </Link>
      )}
    </div>
  );
};

export default AdjacentPosts;
