import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatRooms: [],
};

export const chatRoomsSlice = createSlice({
  name: "chatRooms",
  initialState,
  reducers: {
    setChatRooms: (state, action) => {
      state.chatRooms = action.payload;
    },
    removeChatRoom: (state, action) => {
      const newChats = state.chatRooms.filter(
        (chat) => chat.id !== action.payload
      );
      state.chatRooms = newChats;
    },
  },
});

export const { setChatRooms, removeChatRoom } = chatRoomsSlice.actions;

export default chatRoomsSlice.reducer;
