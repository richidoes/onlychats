import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user";
import postsReducer from "../features/posts";
import chatRoomsReducer from "../features/chatRooms";
import notificationsReducer from "../features/notifications";

export const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postsReducer,
    chatRooms: chatRoomsReducer,
    notifications: notificationsReducer,
  },
});
