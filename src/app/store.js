import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user";
import postsReducer from "../features/posts";

export const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postsReducer,
  },
});
