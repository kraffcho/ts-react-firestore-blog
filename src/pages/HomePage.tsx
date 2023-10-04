import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchPosts } from "../postSlice";
import { RootState, AppDispatch } from "../store";
import { formatDate } from "../utils/formatDate";
import { Helmet } from "react-helmet-async";
import { categoryNameToColor } from "../utils/categoriesColors";
import ReadingTime from "../components/ReadingTime";

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector((state: RootState) => state.posts.posts);
  const status = useSelector((state: RootState) => state.posts.status);
  const error = useSelector((state: RootState) => state.posts.error);
  const { categoryName } = useParams();

  interface CategoryCount {
    [key: string]: number;
  }

  // Extract unique categories from posts, ensuring we only deal with non-undefined categories.
  const categories = Array.from(
    new Set(posts.map((post) => post.category).filter(Boolean))
  ) as string[];

  // Count the number of posts for each category.
  const categoryCounts = categories.reduce<CategoryCount>((acc, cat) => {
    acc[cat] = posts.filter((post) => post.category === cat).length;
    return acc;
  }, {});

  // Truncate post summaries to a maximum length.
  const truncateSummary = (content: string, maxLength = 120): string => {
    if (content.length <= maxLength) return content;

    // Find the last space before the maxLength
    let endIndex = maxLength;
    while (endIndex > 0 && content[endIndex] !== " ") {
      endIndex--;
    }

    // If no space was found, just cut off at the maxLength
    if (endIndex === 0) endIndex = maxLength;

    return content.slice(0, endIndex) + "...";
  };


  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts());
    }
  }, [status, dispatch]);

  if (status === "loading")
    return <p className="loading animate__animated animate__fadeIn">Loading</p>;
  if (error) return <p>Error: {error}</p>;
  if (posts.length === 0) return null;

  const filteredPosts = categoryName
    ? posts.filter((post) => post.category === categoryName)
    : posts;

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
      <h2>
        {categoryName ? `Posts in category: ${categoryName}` : "Showing All Posts"}
      </h2>
      <ul className="category-links">
        <li>
          <Link to="/" className={!categoryName ? "active" : "inactive"}>
            All ({posts.length})
          </Link>
        </li>
        {categories.map((cat) => (
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
        {[...filteredPosts]
          .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
          .map((post, index) => (
            <li
              key={post.id}
              className="animate__animated animate__zoomInUp"
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
              <p className="post-summary">{truncateSummary(post.content)}</p>
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
    </div>
  );
};

export default HomePage;
