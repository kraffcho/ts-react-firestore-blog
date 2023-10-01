import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NewlineText from "../components/NewlineText";
import { db } from "../firebase";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import "firebase/firestore";

interface Post {
  id?: string;
  title: string;
  content: string;
  publishedAt: Timestamp;
  updatedAt: Timestamp;
}

const PostPage: React.FC = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  }, [id]);

  if (loading) return <p className="loading animate__animated animate__fadeIn">Loading</p>;
  if (error) return <p>{error}</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div className="container animate__animated animate__fadeIn">
      <h1>{post.title}</h1>
      <div className="blog-post">
        <NewlineText text={post.content} />
        <div className="blog-post-footer">
          <div className="date-published">
            Published:{" "}
            {post.publishedAt
              ? post.publishedAt.toDate().toLocaleString()
              : "N/A"}
            {post.updatedAt &&
              post.publishedAt.seconds !== post.updatedAt.seconds && (
                <>
                  <br />
                  Updated: {post.updatedAt.toDate().toLocaleString()}
                </>
              )}
          </div>
          <Link to={`/edit-post/${id}`} className="edit-post">
            Edit Post
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
