import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosConfig';

const initialState = {
    data: null,
    status: 'idle',
    error: null,
};

export const fetchAttendanceSummary = createAsyncThunk(
    'attendanceSummary/fetchAttendanceSummary',
    async () => {
      try {
        const response = await axiosInstance.get('/attendance-summary');
        return response.data;
      } catch (error) {
        throw error;
      }
    }
  );