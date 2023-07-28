import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  firstName: null,
  lastName: null,
  profilePicture: null,
  email: null,
  status: null,
  notificationToken: null,
  latitude: null,
  longitude: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => (state = action.payload),
    resetUser: (state) => (state = {
        id: null,
        firstName: null,
        lastName: null,
        profilePicture: null,
        email: null,
        status: null,
        notificationToken: null,
        latitude: null,
        longitude: null,
      }),
    resetProfilePicture: (state, action) => ({
        ...state,
        profilePicture: action.payload,
      }),
    resetFirstName: (state, action) => ({
        ...state,
        firstName: action.payload,
      }),
    resetlastName: (state, action) => ({
        ...state,
        lastName: action.payload,
      }),
    resetStatus: (state, action) => ({
        ...state,
        status: action.payload,
      }),
    resetNotificationToken: (state, action) => ({
        ...state,
        notificationToken: action.payload,
      }),
    resetLocation: (state, action) => {
      const { latitude, longitude } = action.payload;
      return {
        ...state,
        latitude,
        longitude,
      };
    },
  },
});

export const {
  setUser,
  resetUser,
  resetProfilePicture,
  resetFirstName,
  resetStatus,
  resetlastName,
  resetLocation,
  resetNotificationToken,
} = userSlice.actions;
export default userSlice.reducer;
