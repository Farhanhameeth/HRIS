import  { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosConfig';

const initialState = {
    upcomingEvents : [],
    status : 'idle',
    error : null,
    // selectedDate: '2024-09-22'//new Date().toISOString().split('T')[0], // Initialize with the current date in YYYY-MM-DD format
};

const fetchUpcomingEvents = createAsyncThunk(
    'upcomingEvents/fetchUpcomingEvents',
    async (selectedDate) => {
        try {
            // Prepare the data payload
            const data = {
                startDate: selectedDate
            };
            const response = await axiosInstance.post('/api/EventDetails/getEvents', { startDate: selectedDate });
            console.log('Request successful. Response:', response);
            return response.data;
        } catch (error) {
            console.error('Request failed. Error:', error);
            throw error;
        }
    }
);

const upcomingEventsSlice = createSlice({
    name: 'upcomingEvents',
    initialState,
    reducers : {
        setUpcomingEvents: (state, action) => {
            state.upcomingEvents = action.payload;
        },
        setSelectedDate: (state, action) => {
            state.selectedDate = action.payload;
        },
    },
    extraReducers : (builder) => {
        builder
        .addCase(fetchUpcomingEvents.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        })
        .addCase(fetchUpcomingEvents.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.upcomingEvents = action.payload;
        })
        .addCase(fetchUpcomingEvents.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })
    }
});

export const { setUpcomingEvents, setSelectedDate } =upcomingEventsSlice.actions;
export const selectUpcomingEvents = (state) => state.upcomingEvents.upcomingEvents;
export default upcomingEventsSlice.reducer;
export { fetchUpcomingEvents };

