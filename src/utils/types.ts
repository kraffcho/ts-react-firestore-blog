import { Timestamp } from "firebase/firestore";

export interface Post {
  id: string;
  title: string;
  content: string;
  category?: string;
  publishedAt: Timestamp;
  updatedAt: Timestamp;
  commentCount: number;
}

export type Comment = {
  id: string;
  uid: string;
  postId: string;
  author: string;
  content: string;
  timestamp: Timestamp;
};
