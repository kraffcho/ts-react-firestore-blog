import { useState, useEffect } from "react";
import { db } from "../firebase";
import { Comment, Post } from "../utils/types";
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore";
import fetchPostById from "../utils/fetchPostById";

export const useLatestComments = (LIMIT_COMMENTS = 10) => {
  const [latestComments, setLatestComments] = useState<Comment[]>([]);
  const [posts, setPosts] = useState<{ [key: string]: Post }>({});

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
  }, [LIMIT_COMMENTS]);

  return { latestComments, posts };
};
