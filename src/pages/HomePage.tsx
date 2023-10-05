import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchPosts } from "../postSlice";
import { RootState, AppDispatch } from "../store";
import { formatDate } from "../utils/formatDate";
import { Helmet } from "react-helmet-async";
import { categoryNameToColor } from "../utils/categoriesColors";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import ReadingTime from "../components/ReadingTime";

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector((state: RootState) => state.posts.posts);
  const status = useSelector((state: RootState) => state.posts.status);
  const error = useSelector((state: RootState) => state.posts.error);
  const { categoryName } = useParams();

  const [currentPage, setCurrentPage] = React.useState(1);
  const POSTS_PER_PAGE = 4;

  interface CategoryCount {
    [key: string]: number;
  }

  const categories = Array.from(
    new Set(posts.map((post) => post.category).filter(Boolean))
  ) as string[];

  const categoryCounts = categories.reduce<CategoryCount>((acc, cat) => {
    acc[cat] = posts.filter((post) => post.category === cat).length;
    return acc;
  }, {});

  const convertDraftJsContentToHTML = (rawContent: any): string => {
    let contentState;

    if (typeof rawContent === "string") {
      try {
        contentState = convertFromRaw(JSON.parse(rawContent));
      } catch (error) {
        console.error("Failed to parse string content:", error);
        // Handle this case, maybe return an error string or empty string
        return "Error in content";
      }
    } else if (typeof rawContent === "object") {
      contentState = convertFromRaw(rawContent);
    } else {
      console.error("Unknown content type:", typeof rawContent);
      // Handle this case
      return "Unknown content format";
    }

    return stateToHTML(contentState);
  };

  const parseDraftJsContent = (rawContent: any) => {
    if (typeof rawContent === "string") {
      try {
        return JSON.parse(rawContent);
      } catch (error) {
        console.error("Failed to parse string content:", error);
        return null; // or some default/fallback value
      }
    } else if (typeof rawContent === "object") {
      return rawContent;
    } else {
      console.error("Unknown content type:", typeof rawContent);
      return null; // or some default/fallback value
    }
  };

  const truncateSummary = (content: string, maxLength = 120): string => {
    try {
      const contentObject = parseDraftJsContent(content);
      const contentHTML = convertDraftJsContentToHTML(contentObject);
      if (contentHTML.length <= maxLength) return contentHTML;

      let endIndex = maxLength;
      while (endIndex > 0 && contentHTML[endIndex] !== " ") {
        endIndex--;
      }

      if (endIndex === 0) endIndex = maxLength;

      return contentHTML.slice(0, endIndex) + "...";
    } catch (e) {
      console.error("Error processing content:", e);
      return "Error displaying content";
    }
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts());
    }
  }, [status, dispatch]);

  // Reset current page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryName]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  if (status === "loading")
    return <p className="loading animate__animated animate__fadeIn">Loading</p>;
  if (error) return <p>Error: {error}</p>;
  if (posts.length === 0) return <p className="no-posts">No posts available at the moment.</p>;

  const filteredPosts = categoryName
    ? posts.filter((post) => post.category === categoryName)
    : posts;

  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;

  const sortedPosts = [...filteredPosts].sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : -1
  );
  const pagedPosts = sortedPosts.slice(start, end);

  // Calculate the total number of pages based on the number of filtered posts and the number of posts per page
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  // Determine the range of pages to be shown
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);

  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  return (
    <div className="container animate__animated animate__fadeIn">
      <Helmet>
        <title>
          {categoryName ? `Posts in category: ${categoryName}` : "Latest Posts"}
        </title>
        <meta
          name="description"
          content={
            categoryName
              ? `Explore posts from the ${categoryName} category.`
              : "Browse the latest posts from all categories."
          }
        />
      </Helmet>
      <h2 className="heading">
        {categoryName
          ? `Posts in category: ${categoryName}`
          : "Showing All Posts"}
      </h2>
      <ul className="category-links">
        <li>
          <Link to="/" className={!categoryName ? "active" : "inactive"}>
            All ({posts.length})
          </Link>
        </li>
        {categories
          .sort((a, b) => categoryCounts[b] - categoryCounts[a])
          .map((cat) => (
            <li key={cat}>
              <Link
                to={`/category/${cat}`}
                className={cat === categoryName ? "active" : "inactive"}
              >
                {cat} ({categoryCounts[cat]})
              </Link>
            </li>
          ))}
      </ul>
      <ul className="list-posts">
        {[...pagedPosts]
          .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
          .map((post, index) => (
            <li
              key={post.id}
              className={`animate__animated ${
                index % 2 === 0 ? "animate__zoomInRight" : "animate__zoomInLeft"
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {post.title ? (
                <Link to={`/post/${post.id}`}>{post.title}</Link>
              ) : (
                <p>Untitled Post</p>
              )}
              {post.publishedAt && (
                <p className="post-date">
                  Published: {formatDate(new Date(post.publishedAt))}
                </p>
              )}
              <p
                className="post-summary"
                dangerouslySetInnerHTML={{
                  __html: truncateSummary(post.content),
                }}
              ></p>
              <div className="labels-wrapper">
                {post.category && (
                  <Link
                    to={`/category/${post.category}`}
                    className="category-label"
                    style={{
                      backgroundColor: categoryNameToColor(post.category),
                    }}
                  >
                    {post.category}
                  </Link>
                )}
                <ReadingTime content={post.content} />
              </div>
            </li>
          ))}
      </ul>
      {filteredPosts.length > POSTS_PER_PAGE && (
        <div className="pagination animate__animated animate__slideInDown">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &laquo; Prev
          </button>

          {Array.from(
            { length: endPage - startPage + 1 },
            (_, idx) => startPage + idx
          ).map((page) => (
            <span
              key={page}
              className={page === currentPage ? "active-page" : ""}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </span>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next &raquo;
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
