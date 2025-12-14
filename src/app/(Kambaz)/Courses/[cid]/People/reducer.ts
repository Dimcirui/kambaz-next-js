"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users: [] as any[],
    user: null,
};

const peopleSlice = createSlice({
    name: "people",
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload;
        },

        addUser: (state, action) => {
            state.users = [action.payload, ...state.users];
        },

        deleteUser: (state, action) => {
            state.users = state.users.filter((user) => user._id !== action.payload);
        },

        updateUser: (state, action) => {
            state.users = state.users.map((user) =>
                user._id === action.payload._id ? action.payload : user
            );
        },

        setUser: (state, action) => {
            state.user = action.payload;
        },
    },
});

export const {
    setUsers,
    addUser,
    deleteUser,
    updateUser,
    setUser
} = peopleSlice.actions;
export default peopleSlice.reducer;