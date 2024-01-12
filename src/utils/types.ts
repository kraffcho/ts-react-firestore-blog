import { Timestamp } from "firebase/firestore";

declare module 'md5' {
  function md5(value: string): string;
}

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
  editedAt: any;
  id: string;
  uid: string;
  postId: string;
  author: string;
  email: string;
  content: string;
  timestamp: Timestamp;
};

export type UserRole = "admin" | "writer" | "user";
export type UserRoles = {
  [uid: string]: UserRole;
};
interface Option {
  text: string;
  votes: number;
}
interface PollData {
  id: string;
  question: string;
  options: {
    [key: string]: Option;
  };
  votedIPs: string[];
}

export type { Option, PollData };
