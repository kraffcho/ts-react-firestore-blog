import { createSlice } from "@reduxjs/toolkit";

export const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    postSummaryLength: 100,
    minCommentLength: 30,
    maxCommentLength: 1000,
    showProgressBar: true,
    minPostTitleLength: 30,
    minPostContentLength: 1000,
    userRoles: {},
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
    setUserRoles: (state, action) => {
      state.userRoles = action.payload;
    },
  },
});

export const {
  setPostSummaryLength,
  setMinCommentLength,
  setMaxCommentLength,
  toggleProgressBar,
  setMinPostTitleLength,
  setMinPostContentLength,
  setUserRoles,
} = settingsSlice.actions;

export default settingsSlice.reducer;
