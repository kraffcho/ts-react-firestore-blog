import { db } from "../firebase";
import { getDocs, collection, where, query } from "firebase/firestore";
import { Post } from "./types";

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
