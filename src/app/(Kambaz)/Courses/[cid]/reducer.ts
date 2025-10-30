import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showNavigation: true,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleNavigation: (state) => {
      state.showNavigation = !state.showNavigation;
    },
  },
});

export const { toggleNavigation } = uiSlice.actions;
export default uiSlice.reducer;