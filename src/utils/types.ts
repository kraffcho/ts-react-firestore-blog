import { Timestamp } from "firebase/firestore";

export interface Post {
  userId: string;
  timestamp: any;
  id: string;
  title: string;
  content: string;
  category?: string;
  publishedAt: Timestamp;
  updatedAt: Timestamp;
  commentCount: number;
  viewCount?: number;
  savedBy?: string[];
}

export type Comment = {
  id: string;
  uid: string;
  postId: string;
  author: string;
  content: string;
  timestamp: Timestamp;
};
