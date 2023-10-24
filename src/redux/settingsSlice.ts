import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  postSummaryLength: number;
  minCommentLength: number;
  maxCommentLength: number;
  showProgressBar: boolean;
  minPostTitleLength: number;
  minPostContentLength: number;
  userRoles: Record<string, string>;
}

const initialState: SettingsState = {
  postSummaryLength: 100,
  minCommentLength: 30,
  maxCommentLength: 1000,
  showProgressBar: true,
  minPostTitleLength: 30,
  minPostContentLength: 1000,
  userRoles: {},
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setPostSummaryLength: (state, action: PayloadAction<number>) => {
      state.postSummaryLength = action.payload;
    },
    setMinCommentLength: (state, action: PayloadAction<number>) => {
      state.minCommentLength = action.payload;
    },
    setMaxCommentLength: (state, action: PayloadAction<number>) => {
      state.maxCommentLength = action.payload;
    },
    toggleProgressBar: (state) => {
      state.showProgressBar = !state.showProgressBar;
    },
    setMinPostTitleLength: (state, action: PayloadAction<number>) => {
      state.minPostTitleLength = action.payload;
    },
    setMinPostContentLength: (state, action: PayloadAction<number>) => {
      state.minPostContentLength = action.payload;
    },
    setUserRoles: (state, action: PayloadAction<Record<string, string>>) => {
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
