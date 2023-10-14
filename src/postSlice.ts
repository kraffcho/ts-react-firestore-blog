import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { db } from "./firebase";
import { serverTimestamp, deleteDoc } from "firebase/firestore";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

interface Post {
  id?: string;
  title: string;
  content: string;
  category?: string;
  publishedAt: string;
  updatedAt: string;
  commentCount: number;
  viewCount?: number;
  savedBy?: string[];
}

interface NewPostPayload {
  title: string;
  content: string;
  category: string;
}

interface UpdatePostPayload {
  id: string;
  title: string;
  content: string;
  category: string;
}

interface InitialState {
  posts: Post[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: InitialState = {
  posts: [],
  status: "idle",
  error: null,
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const querySnapshot = await getDocs(collection(db, "posts"));
  let posts: Post[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    posts.push({
      id: doc.id,
      title: data.title,
      content: data.content,
      category: data.category,
      publishedAt: data.publishedAt
        ? data.publishedAt.toDate().toISOString()
        : "N/A",
      updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : "N/A",
      commentCount: data.commentCount || 0,
      viewCount: data.viewCount || 0,
    } as Post);
  });
  return posts;
});

export const addPost = createAsyncThunk(
  "posts/addPost",
  async (post: NewPostPayload) => {
    const newPost = {
      ...post,
      commentCount: 0,
      publishedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, "posts"), newPost);
    return {
      id: docRef.id,
      ...post,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Post;
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (payload: UpdatePostPayload) => {
    const { id, title, content, category } = payload;
    const postRef = doc(db, "posts", id);
    await updateDoc(postRef, {
      title,
      content,
      category,
      updatedAt: serverTimestamp(),
    });
    return {
      ...payload,
      updatedAt: new Date().toISOString(),
    };
  }
);

export const getPost = createAsyncThunk("posts/get", async (postId: string) => {
  const postDoc = await getDoc(doc(db, "posts", postId));
  if (postDoc.exists()) {
    const data = postDoc.data();
    return {
      ...data,
      publishedAt: data.publishedAt
        ? data.publishedAt.toDate().toISOString()
        : "N/A",
      updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : "N/A",
      commentCount: data.commentCount || 0,
    } as Post;
  } else {
    throw new Error("Post not found");
  }
});

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId: string) => {
    await deleteDoc(doc(db, "posts", postId));
    return postId;
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        action.payload.forEach((newPost) => {
          if (!state.posts.find((post) => post.id === newPost.id)) {
            state.posts.push(newPost);
          }
        });
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        const existingPostIndex = state.posts.findIndex(
          (post) => post.id === action.payload.id
        );
        if (existingPostIndex >= 0) {
          return;
        }
        state.posts.push(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const { id, title, content, category } = action.payload;
        const existingPost = state.posts.find((post) => post.id === id);
        if (existingPost) {
          existingPost.title = title;
          existingPost.content = content;
          existingPost.category = category;
          existingPost.updatedAt = new Date().toISOString();
        }
      })
      .addCase(getPost.fulfilled, (state, action: PayloadAction<Post>) => {
        const index = state.posts.findIndex(
          (post) => post.id === action.payload.id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        } else {
          state.posts.push(action.payload);
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload);
      });
  },
});

export default postSlice.reducer;
