import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosConfig";

const initialState = {};

const hardcodedemployeeId = '100';

export const fetchVisualLeaveData = createAsyncThunk(
  "visualLeave/fetchVisualLeaveData",
  async () => {
    try {
      const response = await axiosInstance.post("/api/LeaveDetails/getVisualLeaveData", { employeeId: hardcodedemployeeId });
      console.log("Request successful. Response:", response);
      return response.data;
    } catch (error) {
      console.error("Request failed. Error:", error);
      throw error;
    }
  }
);

// Slice for managing the visual leave data
const visualLeaveSlice = createSlice({
    name: "visualLeave",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchVisualLeaveData.pending, (state) => {
          state.status = 'loading';
          state.error = null;
        })
        .addCase(fetchVisualLeaveData.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.visualLeaveData = action.payload;
        })
        .addCase(fetchVisualLeaveData.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload || action.error.message;
        });
    },
  });

  // Selector to access visual leave data from the store
export const selectVisualLeaveData = (state) => state.visualLeave.visualLeaveData;

export default visualLeaveSlice.reducer;