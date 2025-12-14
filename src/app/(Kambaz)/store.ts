"use client"
import { configureStore } from "@reduxjs/toolkit";
import coursesReducer from "./Courses/reducer";
import modulesReducer from "./Courses/[cid]/Modules/reducer";
import accountReducer from "./Account/reducer";
import uiReducer from "./Courses/[cid]/reducer";
import assignmentsReducer from "./Courses/[cid]/Assignments/reducer";
import enrollmentsReducer from "./Dashboard/reducer";
import peopleReducer from "./Courses/[cid]/People/reducer";

const store = configureStore({
  reducer: {
    coursesReducer,
    modulesReducer,
    accountReducer,
    uiReducer,
    assignmentsReducer,
    enrollmentsReducer,
    peopleReducer,
  },
});
export default store;