import { Timestamp } from "firebase/firestore";

export interface Post {
  id: string;
  title: string;
  content: string;
  category?: string;
  publishedAt: Timestamp;
  updatedAt: Timestamp;
}
