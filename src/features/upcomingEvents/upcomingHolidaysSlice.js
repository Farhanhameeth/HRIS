import  { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosConfig';

const initialState = {
    holidays: [],
    status: 'idle',
    error: null,
};

const fetchHolidays = createAsyncThunk(
    'holidays/fetchHolidays',
    async ({ startDate, endDate }) => {
        try {
            // Prepare the request data
            const params = {
                startDate,
                endDate,
            };
            
            // Make the request to the backend API
            const response = await axiosInstance.get('/api/EventDetails/getHolidays', {
                params, // Send the startDate and endDate as query parameters
            });
            console.log('Request successful. Response:', response.data);
            return response.data; // Assuming the API returns the holiday data
        } catch (error) {
            console.error('Request failed. Error:', error);
            throw error;
        }
    }
);

// Slice to manage holidays state
const holidaysSlice = createSlice({
    name: 'holidays',
    initialState,
    reducers: {
        setHolidays: (state, action) => {
            state.holidays = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHolidays.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchHolidays.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.holidays = action.payload;
            })
            .addCase(fetchHolidays.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

// Export actions and selector
export const { setHolidays } = holidaysSlice.actions;
export const selectHolidays = (state) => state.upcomingHolidays.holidays;

// Export reducer and async thunk
export default holidaysSlice.reducer;
export { fetchHolidays };