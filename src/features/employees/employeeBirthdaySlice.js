import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosConfig';

const initialState = {
  employeeBirthdays: [],
  status: 'idle',
  error: null,
};

// Hardcoded month for testing purposes
const hardcodedMonth = 3; // e.g., July

// Async thunk to fetch employee birthdays from API for a specific month
export const fetchEmployeeBirthdays = createAsyncThunk(
  'employeeBirthday/fetchEmployeeBirthdays',
  async (month) => { // Add month parameter here
    try {
        const response = await axiosInstance.post('/api/EmployeeDetails/getEmployeeBirthdaysByMonth', { month : hardcodedMonth });
        console.log('Request successful. Response:', response);
        return response.data;
    } catch (error) {
        console.error('Request failed. Error:', error);
        throw error;
    }
  }
);

const employeeBirthdaySlice = createSlice({
  name: 'employeeBirthday',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeBirthdays.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchEmployeeBirthdays.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employeeBirthdays = action.payload;
      })
      .addCase(fetchEmployeeBirthdays.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const selectEmployeeBirthdays = (state) => state.employeeBirthday.employeeBirthdays;

export default employeeBirthdaySlice.reducer;
