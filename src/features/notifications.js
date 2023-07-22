import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    deleteNotification: (state, action) => {
      const newState = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
      state.notifications = newState;
    },
    loadMoreNotifications: (state, action) => {
      state.notifications = [...state.notifications, ...action.payload];
    },
    markNotificationAsSeen: (state, action) => {
      state.notifications = state.notifications.map((notification) => {
        if (notification.id === action.payload) {
          notification.isSeen = true;
        }
        return notification;
      });
    },
  },
});

export const {
  setNotifications,
  markNotificationAsSeen,
  deleteNotification,
  loadMoreNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
