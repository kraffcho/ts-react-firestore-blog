import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NewlineText from "../components/NewlineText";
import AdjacentPosts from "../components/AdjacentPosts";
import { db } from "../firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import "firebase/firestore";
import { Helmet } from "react-helmet-async";
import { formatDate } from "../utils/formatDate";
import { Post } from "../utils/types";

const PostPage: React.FC = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("Invalid post ID");
        return;
      }

      try {
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() } as Post);
        } else {
          setError("Post does not exist");
        }
      } catch (e) {
        setError("Error fetching post");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "posts"));
        setAllPosts(
          querySnapshot.docs.map((doc) => {
            if (!doc.id) throw new Error("Document missing ID");
            return { id: doc.id, ...doc.data() } as Post;
          })
        );
      } catch (e) {
        console.error("Error fetching all posts:", e);
      }
    };
    fetchAllPosts();
  }, []);

  if (loading) return <p className="loading animate__animated animate__fadeIn">Loading</p>;
  if (error) return <p>{error}</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div className="container animate__animated animate__fadeIn">
      <Helmet>
        <title>{post ? post.title : "Loading..."}</title>
        <meta
          name="description"
          content={post ? post.content.substring(0, 155) : "Loading..."}
        />
      </Helmet>
      <h1>
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
          <NewlineText text={post.content} />
        </div>
        <div className="blog-post-footer">
          <div className="date-published">
            Published:{" "}
            {post.publishedAt ? formatDate(post.publishedAt.toDate()) : "N/A"}
          </div>
          <Link to={`/edit-post/${id}`} className="edit-post">
            Update
          </Link>
        </div>
      </div>
      {allPosts.length > 0 && (
        <AdjacentPosts currentPostId={id!} allPosts={allPosts} />
      )}
    </div>
  );
};

export default PostPage;
