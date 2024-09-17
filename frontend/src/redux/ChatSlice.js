import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        onlineUsers: [],
        message: [],
    },
    reducers: {
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        setMessage: (state, action) => {
            state.message = action.payload;
        }
    }
})

export const { setOnlineUsers, setMessage } = chatSlice.actions;
export default chatSlice.reducer;
