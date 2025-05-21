import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosConfig';

const initialState = {
    securityQuestions: [], // Array to store fetched security questions
    loading: false,
    error: null,
};

const hardcodedEmployeeId = 100;

export const fetchSecurityQuestions = createAsyncThunk(
    'securityQuestions/fetchSecurityQuestions',
    async () => {
        try {
            const response = await axiosInstance.post('/api/EmployeewiseSecurityQuestion/getEmployeeSecurityQuestion', { employeeId: hardcodedEmployeeId });
            console.log('Request successful. Response:', response);
            return response.data;
        } catch (error) {
            console.error('Request failed. Error:', error);
            throw error;
        }
    }
);

const securityQuestionsSlice = createSlice({
    name: 'securityQuestions',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchSecurityQuestions.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchSecurityQuestions.fulfilled, (state, action) => {
            state.loading = false;
            state.securityQuestions = action.payload;
        })
        .addCase(fetchSecurityQuestions.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});

// export const selectSecurityQuestions = (state) => state.securityQuestions;

// Selector to get the security questions from the state
export const selectSecurityQuestions = (state) => state.employeeSecurityQuestions.securityQuestions;

// Export the reducer to include in the store
export default securityQuestionsSlice.reducer;
