import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { Comment, Post } from "../utils/types";
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore";
import fetchPostById from "../utils/fetchPostById";
import { formatDate } from "../utils/formatDate";

const LatestComments: React.FC = () => {
  const [latestComments, setLatestComments] = useState<Comment[]>([]);
  const [posts, setPosts] = useState<{ [key: string]: Post }>({});
  const LIMIT_COMMENTS = 5;
  const TRUNCATE_LENGTH = 200;

  useEffect(() => {
    const fetchLatestComments = async () => {
      try {
        const commentsCollection = collection(db, "comments");
        const q = query(
          commentsCollection,
          orderBy("timestamp", "desc"),
          limit(LIMIT_COMMENTS)
        );

        const querySnapshot = await getDocs(q);
        const fetchedComments = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Comment)
        );

        setLatestComments(fetchedComments);

        // Fetch associated posts for the fetched comments
        const uniquePostIds = Array.from(
          new Set(fetchedComments.map((comment) => comment.postId))
        );
        const postPromises = uniquePostIds.map(fetchPostById);
        const fetchedPosts = await Promise.all(postPromises);
        const postsMap: { [key: string]: Post } = {};
        fetchedPosts.forEach((post) => {
          postsMap[post.id] = post;
        });

        setPosts(postsMap);
      } catch (e) {
        console.error("Error fetching latest comments:", e);
      }
    };
    fetchLatestComments();
  }, []);

  return (
    <div className="latest-comments">
      <h2>Recent Comments from Our Community</h2>
      {latestComments.map((comment) => {
        const truncatedContent =
          comment.content.length > TRUNCATE_LENGTH
            ? comment.content.substring(0, TRUNCATE_LENGTH) + "... (truncated)"
            : comment.content;

        return (
          <div key={comment.id} className="comment">
            <strong>{comment.author}</strong>: {truncatedContent}
            <div className="comment-metadata">
              <div className="comment-date">
                <span className="material-symbols-outlined">schedule</span>
                {formatDate(comment.timestamp.toDate())} on
              </div>
              <Link to={`/post/${comment.postId}#${comment.id}`}>
                {posts[comment.postId]?.title}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LatestComments;
