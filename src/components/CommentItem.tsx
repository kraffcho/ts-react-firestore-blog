import React from "react";
import { Link } from "react-router-dom";
import { Comment } from "../utils/types";
import { truncate } from "../utils/truncate";
import { formatDate } from "../utils/formatDate";

interface CommentItemProps {
  comment: Comment;
  postTitle?: string;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, postTitle }) => {
  const truncatedContent = truncate(comment.content, 200);

  return (
    <div key={comment.id} className="item animate__animated animate__fadeIn">
      <div className="author-content">
        <strong>{comment.author}</strong> {truncatedContent}
      </div>
      <div className="metadata">
        <div className="date">
          <span className="material-symbols-outlined notranslate">pending_actions</span>
          {formatDate(comment.timestamp.toDate())}
        </div>
        {postTitle && (
          <Link to={`/post/${comment.postId}#${comment.id}`}>{postTitle}</Link>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
