import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosConfig'; // Adjust the path as per your file structure


const initialState = {
  announcements: [],
  status: 'idle',
  error: null,
};

// Hardcoded targetDepartmentId for testing purposes
const hardcodedDepartmentId = 1;

// Async thunk to fetch announcements from API with hardcoded targetDepartmentId
export const fetchAnnouncements = createAsyncThunk(
  'announcement/fetchAnnouncements',
  async () => {
    try {
      const response = await axiosInstance.post('/api/AnnouncementDetails/getAnnouncement', { targetDepartmentId: hardcodedDepartmentId });
      console.log('Request successful. Response:', response);
      return response.data;
    } catch (error) {
      console.error('Request failed. Error:', error);
      throw error;
    }
  }
);

const announcementSlice = createSlice({
  name: 'announcement',
  initialState,
  reducers: {
    setAnnouncements: (state, action) => {
      state.announcements = action.payload; // Assuming action.payload is an array of announcements
    },
    addAnnouncement: (state, action) => {
      state.announcements.push(action.payload);
    },
    removeAnnouncement: (state, action) => {
      state.announcements = state.announcements.filter(
        (announcement) => announcement.date !== action.payload
      );
    },
    selectAnnouncements: (state) => state.announcements,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnnouncements.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.announcements = action.payload;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setAnnouncements, addAnnouncement, removeAnnouncement } = announcementSlice.actions;

export const selectAnnouncements = (state) => state.announcement.announcements;

export default announcementSlice.reducer;
