import { createSlice } from '@reduxjs/toolkit';

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: {
    showDropdown: false,
    isCollapsed: false,
  },
  reducers: {
    toggleDropdown: (state) => {
      state.showDropdown = !state.showDropdown;
    },
    toggleSidebar: (state) => {
      state.isCollapsed = !state.isCollapsed;
    },
    setDropdown: (state, action) => {
      state.showDropdown = action.payload;
    },
  },
});

export const { toggleDropdown, toggleSidebar, setDropdown } = sidebarSlice.actions;

export default sidebarSlice.reducer;
