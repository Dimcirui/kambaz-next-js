"use client"
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    enrolledCourses: [] as string[],
};

const enrollmentsSlice = createSlice({
    name: "enrollments",
    initialState,
    reducers: {
        setEnrollments: (state, action) => {
            state.enrolledCourses = action.payload;
        },

        enrollCourse: (state, action) => {
            if (!state.enrolledCourses.includes(action.payload)) {
                state.enrolledCourses.push(action.payload);
            }
        },
        unenrollCourse: (state, action) => {
            state.enrolledCourses = state.enrolledCourses.filter(
                (id) => id !== action.payload
            );
        },
    },
});

export const { setEnrollments, enrollCourse, unenrollCourse } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
