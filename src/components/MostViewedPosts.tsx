import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { Post } from "../utils/types";
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore";
import { formatDate } from "../utils/formatDate";
import { categoryNameToColor } from "../utils/categoriesColors";

const MostViewedPosts: React.FC = () => {
  const [mostViewed, setMostViewed] = useState<Post[]>([]);
  const LIMIT_POSTS = 5;

  useEffect(() => {
    const fetchMostViewedPosts = async () => {
      try {
        const postsCollection = collection(db, "posts");
        const q = query(
          postsCollection,
          orderBy("viewCount", "desc"),
          limit(LIMIT_POSTS)
        );

        const querySnapshot = await getDocs(q);
        const fetchedPosts = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Post)
        );

        setMostViewed(fetchedPosts);
      } catch (e) {
        console.error("Error fetching most viewed posts:", e);
      }
    };
    fetchMostViewedPosts();
  }, []);

  const smoothScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="most-viewed-posts animate__animated animate__fadeIn">
      <h2>
        <span className="material-symbols-outlined">visibility</span> Most Viewed
        Posts
      </h2>
      {mostViewed.map((post, index) => {
        return (
          <div
            key={post.id}
            className={`item animate__animated animate__fadeIn`}
          >
            <Link
              to={`/post/${post.id}`}
              style={{ color: categoryNameToColor(post.category!) }}
            >
              {post.title}
            </Link>
            <div className="metadata">
              <div className="date">
                <span className="material-symbols-outlined">
                  pending_actions
                </span>
                {formatDate(post.publishedAt.toDate())} in{" "}
                <Link
                  to={`/category/${post.category}`}
                  onClick={smoothScrollToTop}
                >
                  <span
                    className="category"
                    style={{ color: categoryNameToColor(post.category!) }}
                  >
                    {post.category}
                  </span>
                </Link>
              </div>
              <div className="views">{post.viewCount} views</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MostViewedPosts;
