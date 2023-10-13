import { db } from "../firebase";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { Post, Comment } from "../utils/types";

export const fetchPostById = async (id: string): Promise<Post | null> => {
  const docRef = doc(db, "posts", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Post;
  }
  return null;
};

export const fetchCommentsByPostId = async (
  postId: string
): Promise<Comment[]> => {
  const commentsCollection = collection(db, "comments");
  const q = query(
    commentsCollection,
    where("postId", "==", postId),
    orderBy("timestamp", "desc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Comment)
  );
};

export const fetchAllPosts = async (): Promise<Post[]> => {
  const querySnapshot = await getDocs(collection(db, "posts"));
  return querySnapshot.docs.map((doc) => {
    if (!doc.id) throw new Error("Document missing ID");
    return { id: doc.id, ...doc.data() } as Post;
  });
};

export const fetchSavedPosts = async (userId: string): Promise<Post[]> => {
  const q = query(
    collection(db, "posts"),
    where("savedBy", "array-contains", userId)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as Post)
  );
};
