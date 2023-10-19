import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchPosts } from "../redux/postSlice";
import { RootState, AppDispatch } from "../redux/store";
import { formatDate } from "../utils/formatDate";
import { smoothScrollToTop } from "../utils/smoothScrollToTop";
import { Helmet } from "react-helmet-async";
import { categoryNameToColor } from "../utils/categoriesColors";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import ReadingTime from "../components/ReadingTime";
import PostCalendar from "../components/PostCalendar";
import LatestComments from "../components/LatestComments";
import MostViewedPosts from "../components/MostViewedPosts";
import Poll from "../components/Poll";
import UserProfile from "../components/UserProfile";

type HomePageProps = {
  user: any | null;
  userRoles: { [key: string]: string };
};

const HomePage: React.FC<HomePageProps> = ({ user, userRoles }) => {
  const postSummaryLength = useSelector(
    (state: RootState) => state.settings.postSummaryLength
  );
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector((state: RootState) => state.posts.posts);
  const status = useSelector((state: RootState) => state.posts.status);
  const error = useSelector((state: RootState) => state.posts.error);
  const { categoryName } = useParams();

  const [currentPage, setCurrentPage] = React.useState(1);
  const POSTS_PER_PAGE = 10;

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
        return "Error in content";
      }
    } else if (typeof rawContent === "object") {
      contentState = convertFromRaw(rawContent);
    } else {
      console.error("Unknown content type:", typeof rawContent);
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
        return null;
      }
    } else if (typeof rawContent === "object") {
      return rawContent;
    } else {
      console.error("Unknown content type:", typeof rawContent);
      return null;
    }
  };

  const truncateSummary = (content: string, summary: number): string => {
    try {
      const contentObject = parseDraftJsContent(content);
      const contentHTML = convertDraftJsContentToHTML(contentObject);
      if (contentHTML.length <= summary) return contentHTML;

      let endIndex = summary;
      while (endIndex > 0 && contentHTML[endIndex] !== " ") {
        endIndex--;
      }

      if (endIndex === 0) endIndex = summary;

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

  useEffect(() => {
    setCurrentPage(1);
    smoothScrollToTop();
  }, [categoryName]);

  useEffect(() => {
    smoothScrollToTop();
  }, [currentPage]);

  if (error) return <p>Error: {error}</p>;
  if (posts.length === 0) return null;

  const filteredPosts = categoryName
    ? posts.filter((post) => post.category === categoryName)
    : posts;

  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;

  const sortedPosts = [...filteredPosts].sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : -1
  );
  const pagedPosts = sortedPosts.slice(start, end);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);

  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  return (
    <div className="container home-grid animate__animated animate__fadeIn">
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

      <main>
        <ul className="category-links animate__animated animate__flipInX">
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
                  index % 2 === 0
                    ? "animate__zoomInRight"
                    : "animate__zoomInLeft"
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {post.title ? (
                  <Link
                    to={`/post/${post.id}`}
                    className="post-title"
                    style={{ color: categoryNameToColor(post.category!) }}
                  >
                    {post.title}
                  </Link>
                ) : (
                  <p>Untitled Post</p>
                )}
                {post.publishedAt && (
                  <p className="post-date">
                    Published: {formatDate(new Date(post.publishedAt))}
                    {post.viewCount !== undefined && (
                      <span className="post-views">
                        {" "}
                        &rarr; {post.viewCount} view
                        {post.viewCount !== 1 ? "s" : ""}
                      </span>
                    )}
                  </p>
                )}
                <p
                  className="post-summary"
                  dangerouslySetInnerHTML={{
                    __html: truncateSummary(post.content, postSummaryLength),
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
                  {post.commentCount > 0 && (
                    <Link
                      to={`/post/${post.id}#comments`}
                      className="comments-label"
                    >
                      {post.commentCount} comment
                      {post.commentCount !== 1 && "s"}
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
              <span className="material-symbols-outlined">navigate_before</span>
            </button>

            {Array.from(
              { length: endPage - startPage + 1 },
              (_, idx) => startPage + idx
            ).map((page) => (
              <span
                key={page}
                className={
                  page === currentPage
                    ? "page-number active-page"
                    : "page-number"
                }
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
              <span className="material-symbols-outlined">navigate_next</span>
            </button>
          </div>
        )}
        <LatestComments />
      </main>
      <aside>
        <UserProfile user={user} roles={userRoles} />
        <PostCalendar />
        <MostViewedPosts />
        <Poll pollId="d1byEhAWOGtvVq5I0UrA" />
      </aside>
    </div>
  );
};

export default HomePage;
