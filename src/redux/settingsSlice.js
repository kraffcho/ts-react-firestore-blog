import { createSlice } from "@reduxjs/toolkit";

export const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    minCommentLength: 30,
    maxCommentLength: 1000,
    showProgressBar: true,
  },
  reducers: {
    setMinCommentLength: (state, action) => {
      state.minCommentLength = action.payload;
    },
    setMaxCommentLength: (state, action) => {
      state.maxCommentLength = action.payload;
    },
    toggleProgressBar: (state) => {
      state.showProgressBar = !state.showProgressBar;
    },
  },
});

export const { setMinCommentLength, setMaxCommentLength, toggleProgressBar } =
  settingsSlice.actions;
export default settingsSlice.reducer;
