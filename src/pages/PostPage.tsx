import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Editor, EditorState, convertFromRaw } from "draft-js";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  doc,
  getDocs,
  serverTimestamp,
  orderBy,
  increment,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Helmet } from "react-helmet-async";
import { formatDate } from "../utils/formatDate";
import { Post, Comment } from "../utils/types";
import AdjacentPosts from "../components/AdjacentPosts";
import PostViewTracker from "../components/PostViewTracker";
import BookmarkToggle from "../components/BookmarkToggle";
import ShareButtons from "../components/ShareButtons";
import TimedNotification from "../components/Notification";
import {
  fetchPostById,
  fetchCommentsByPostId,
  fetchAllPosts,
} from "../utils/api";

const PostPage: React.FC = () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const { id } = useParams<any>();
  const { hash } = useLocation();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    if (post && post.content) {
      const contentState = convertFromRaw(JSON.parse(post.content));
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, [post]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("Invalid post ID");
        return;
      }
      try {
        const fetchedPost = await fetchPostById(id);
        if (fetchedPost) {
          setPost(fetchedPost);
          if (
            currentUser &&
            fetchedPost.savedBy &&
            fetchedPost.savedBy.includes(currentUser.uid)
          ) {
            setIsBookmarked(true);
          }
        } else {
          setError("Post does not exist");
        }
        const fetchedComments = await fetchCommentsByPostId(id);
        setComments(fetchedComments);
      } catch (e) {
        setError("Error fetching post");
      } finally {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    fetchData();
  }, [id, currentUser]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await fetchAllPosts();
        setAllPosts(posts);
      } catch (e) {
        console.error("Error fetching all posts:", e);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    if (hash) {
      const timeout = setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView();
          window.scrollBy(0, -80);
        }
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [hash]);

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      const commentRef = doc(db, "comments", commentId);
      // Instead of deleting the comment, we can mark it as deleted
      // and hide it from the UI with a filter in the query
      // await updateDoc(commentRef, {
      //   deleted: true,
      // });

      // Remove the comment from the database
      await deleteDoc(commentRef);

      // Decrease commentCount in the post after deleting one
      const postRef = doc(db, "posts", post!.id);
      await updateDoc(postRef, {
        commentCount: increment(-1),
      });

      // Filter out the deleted comment
      setComments((prevComments) =>
        prevComments.filter((c) => c.id !== commentId)
      );
    } catch (error) {
      console.error("Error deleting comment: ", error);
    }
  };

  const CommentForm: React.FC<{
    postId: string;
    setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  }> = ({ postId, setComments }) => {
    const [author, setAuthor] = useState("");
    const [content, setContent] = useState("");
    const authorRef = React.useRef<HTMLInputElement>(null);
    const contentRef = React.useRef<HTMLTextAreaElement>(null);
    const [notification, setNotification] = useState<string | null>(null);

    const handleSubmit = async () => {
      if (!currentUser) {
        console.error("User is not authenticated");
        return;
      }

      if (!author.trim()) {
        setNotification("Please enter your name.");
        setTimeout(() => setNotification(null), 5000);
        authorRef.current?.focus();
        return;
      }

      if (!content.trim() || content.trim().length < 30) {
        setNotification("Comment must be at least 30 characters long.");
        setTimeout(() => setNotification(null), 5000);
        contentRef.current?.focus();
        return;
      }

      try {
        const commentsCollection = collection(db, "comments");

        await addDoc(commentsCollection, {
          postId,
          uid: currentUser.uid,
          author,
          content,
          timestamp: serverTimestamp(),
        });

        const postRef = doc(db, "posts", postId);
        await updateDoc(postRef, {
          commentCount: increment(1),
        });

        setAuthor("");
        setContent("");

        // Refetch comments after adding one
        const q = query(
          commentsCollection,
          where("postId", "==", postId),
          orderBy("timestamp", "desc")
        );

        const querySnapshot = await getDocs(q);
        const fetchedComments = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Comment)
        );

        setComments(fetchedComments);

        // Scroll to the comment list after fetching the comments
        const commentListElement = document.getElementById("comments");
        if (commentListElement) {
          commentListElement.scrollIntoView({ behavior: "smooth" });
        }
      } catch (error) {
        console.error("Error adding comment: ", error);
      }
    };

    return (
      <div className="comment-form">
        <h2 className="comment-form__title">
          {comments.length > 0
            ? "Leave a Comment"
            : "No comments yet. Be the first one to share your thoughts."}
        </h2>
        <input
          ref={authorRef}
          className="comment-form__input"
          placeholder="Name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <textarea
          ref={contentRef}
          className="comment-form__textarea"
          placeholder="Your comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {notification && (
          <TimedNotification
            message={notification}
            time={5000}
            classes="comment-form__notification animate__animated animate__fadeIn"
          />
        )}
        <button
          className="comment-form__submit btn green"
          onClick={handleSubmit}
        >
          <span className="material-symbols-outlined">add_circle</span>Post
          Comment
        </button>
      </div>
    );
  };

  const CommentList: React.FC<{ postId: string; comments: Comment[] }> = ({
    postId,
    comments,
  }) => {
    const [editingCommentId, setEditingCommentId] = useState<string | null>(
      null
    );
    const [editedContent, setEditedContent] = useState<string>("");

    const handleEditComment = (comment: Comment) => {
      setEditingCommentId(comment.id);
      setEditedContent(comment.content);
    };

    const handleSaveComment = async (commentId: string) => {
      try {
        const commentRef = doc(db, "comments", commentId);
        await updateDoc(commentRef, {
          content: editedContent,
        });

        // Update the local comments state with the new content
        setComments((prevComments) =>
          prevComments.map((c) =>
            c.id === commentId ? { ...c, content: editedContent } : c
          )
        );

        // Reset editing state
        setEditingCommentId(null);
        setEditedContent("");
      } catch (error) {
        console.error("Error updating comment: ", error);
      }
    };
    return (
      <div className="comment-list" id="comments">
        <h2 className="comment-list__title">Join the Discussion Below</h2>
        <h3 className="comment-list__comments">
          {comments.length} comment{comments.length !== 1 && "s"} added:
        </h3>
        {comments.map((comment) => (
          <div key={comment.id} id={comment.id} className="comment-list__item">
            <strong className="comment-list__author">
              {comment.author} says:
            </strong>
            {editingCommentId === comment.id ? (
              <div className="comment-list__edit">
                <label htmlFor="comment-edit">Edit your comment:</label>
                <textarea
                  value={editedContent}
                  id="comment-edit"
                  onChange={(e) => setEditedContent(e.target.value)}
                />
              </div>
            ) : (
              <p className="comment-list__content">{comment.content}</p>
            )}
            <p className="comment-list__timestamp">
              Posted: {formatDate(comment.timestamp.toDate())}
            </p>
            {currentUser && currentUser.uid === comment.uid && (
              <div className="comment-list__buttons">
                {editingCommentId === comment.id ? (
                  <button
                    className="comment-list__save btn green"
                    onClick={() => handleSaveComment(comment.id)}
                  >
                    <span className="material-symbols-outlined">save</span>
                  </button>
                ) : (
                  <button
                    className="comment-list__edit btn yellow"
                    onClick={() => handleEditComment(comment)}
                  >
                    <span className="material-symbols-outlined">edit_note</span>
                  </button>
                )}
                <button
                  className="comment-list__delete btn red"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (error) return <p>{error}</p>;
  if (!post) return null;

  return (
    <div className="container animate__animated animate__fadeIn">
      <PostViewTracker postId={id!} />
      <Helmet>
        <title>{post ? post.title : "Loading..."}</title>
        <meta
          name="description"
          content={post ? post.content.substring(0, 155) : "Loading..."}
        />
      </Helmet>
      <h1 className="post-page-title">
        <BookmarkToggle postId={id!} isInitiallyBookmarked={isBookmarked} />
        {post.title}
        {post.updatedAt &&
          post.publishedAt.seconds !== post.updatedAt.seconds && (
            <>
              <br />
              <span className="title-updated">
                Updated: {formatDate(post.updatedAt.toDate())}
              </span>
            </>
          )}
      </h1>
      <div className="blog-post">
        <div className="blog-post-body">
          <Editor
            editorState={editorState}
            onChange={() => {}}
            readOnly={true}
          />
          <div className="blog-post-footer">
            <div className="date-published">
              Published:{" "}
              {post.publishedAt ? formatDate(post.publishedAt.toDate()) : "N/A"}
              {post.category && (
                <span>
                  {" "}
                  on category:{" "}
                  <Link className="category" to={`/category/${post.category}`}>
                    {post.category}
                  </Link>
                </span>
              )}
            </div>
            <Link to={`/edit-post/${id}`} className="edit-post">
              Manage
            </Link>
          </div>
        </div>
      </div>
      <ShareButtons postTitle={post.title} id={id!} />
      {allPosts.length > 0 && (
        <AdjacentPosts currentPostId={id!} allPosts={allPosts} />
      )}
      {comments.length > 0 && <CommentList postId={id!} comments={comments} />}
      {currentUser ? (
        <CommentForm postId={id!} setComments={setComments} />
      ) : (
        <h2 className="login-to-comment">
          You must be logged in to share your thoughts.
          <br />
          <Link to="/login" className="btn green">
            <span className="material-symbols-outlined">passkey</span>LOGIN
          </Link>
        </h2>
      )}
    </div>
  );
};

export default PostPage;
