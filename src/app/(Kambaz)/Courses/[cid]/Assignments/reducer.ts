import { add } from "@/app/Labs/Lab3/Math";
import { createSlice } from "@reduxjs/toolkit";
// import { assignments } from "../../../Database";
// import { v4 as uuidv4 } from "uuid";

const initialState = {
  assignments: [],
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    // addAssignment: (state, { payload: assignment }) => {
    //   const newAssignment = {
    //     _id: uuidv4(),
    //     title: assignment.title,
    //     course: assignment.course,
    //     available: assignment.available,
    //     due: assignment.due,
    //     points: assignment.points,
    //   };
    //   state.assignments = [...state.assignments, newAssignment] as any;
    // },
    addAssignment: (state, { payload: assignment }) => {
      state.assignments = [...state.assignments, assignment] as any;
    },

    deleteAssignment: (state, { payload: assignmentId }) => {
      state.assignments = state.assignments.filter(
        (assignment: any) => assignment._id !== assignmentId
      );
    },

    updateAssignment: (state, { payload: assignment }) => {
      state.assignments = state.assignments.map((a: any) =>
        a._id === assignment._id ? assignment : a
      ) as any;
    },

    setAssignments: (state, { payload: assignments }) => {
      state.assignments = assignments;
    },
  },
});

export const {
  addAssignment,
  deleteAssignment,
  updateAssignment,
  setAssignments,
} = assignmentsSlice.actions;
export default assignmentsSlice.reducer;