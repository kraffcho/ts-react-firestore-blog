import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./postSlice";
import settingsReducer from "./settingsSlice";

const store = configureStore({
  reducer: {
    posts: postReducer,
    settings: settingsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
