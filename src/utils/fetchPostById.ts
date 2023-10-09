import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Post } from "./types";

const fetchPostById = async (postId: string): Promise<Post> => {
  try {
    const postDoc = doc(db, "posts", postId);
    const postSnapshot = await getDoc(postDoc);

    if (postSnapshot.exists()) {
      return {
        id: postSnapshot.id,
        ...postSnapshot.data(),
      } as Post;
    } else {
      throw new Error(`Post with ID ${postId} doesn't exist`);
    }
  } catch (error) {
    console.error(`Error fetching post with ID ${postId}:`, error);
    throw error;
  }
};

export default fetchPostById;
