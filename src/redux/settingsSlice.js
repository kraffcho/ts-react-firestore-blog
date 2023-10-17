import { createSlice } from "@reduxjs/toolkit";

export const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    postSummaryLength: 100, // post summary length
    minCommentLength: 30, // min comment length
    maxCommentLength: 1000, // max comment length
    showProgressBar: true, // show progress when writing comment
    minPostTitleLength: 30, // min title length for posts
    minPostContentLength: 1000, // min content length for posts
  },
  reducers: {
    setPostSummaryLength: (state, action) => {
      state.postSummaryLength = action.payload;
    },
    setMinCommentLength: (state, action) => {
      state.minCommentLength = action.payload;
    },
    setMaxCommentLength: (state, action) => {
      state.maxCommentLength = action.payload;
    },
    toggleProgressBar: (state) => {
      state.showProgressBar = !state.showProgressBar;
    },
    setMinPostTitleLength: (state, action) => {
      state.minPostTitleLength = action.payload;
    },
    setMinPostContentLength: (state, action) => {
      state.minPostContentLength = action.payload;
    },
  },
});

export const {
  setPostSummaryLength,
  setMinCommentLength,
  setMaxCommentLength,
  toggleProgressBar,
  setTitleMinLength,
  setContentMinLength,
} = settingsSlice.actions;
export default settingsSlice.reducer;
