import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosConfig';
import { useSelector } from 'react-redux';

// import { selectEmployeeId, selectUserId } from '../features/auth/authSlice';
import { selectEmployeeId, selectUserId } from '../auth/authSlice';

// Initial state for employee details, including password-related state variables
const initialState = {
    employeeDetails: {}, // Initialize as an empty object for employee data
    status: 'idle', // Status for fetching employee details
    error: null, // To store errors if any occur during API calls
    isResetPasswordOpen: false, // State for handling the visibility of the password reset form
    passwordStatus: null,  // State for tracking password validation or update status
};

// This is a hardcoded employee ID used to fetch employee details
// const employeeId = useSelector(selectEmployeeId);
export const fetchEmployeeDetails = createAsyncThunk(
    'employeeDetails/fetchEmployeeDetails',
    async (_, { getState, rejectWithValue }) => {
        try {
            const employeeId = getState().auth.employeeId; // Get employeeId from auth slice

            if (!employeeId) {
                return rejectWithValue("No employee ID found in state");
            }

            // API call to fetch employee details using the logged-in employee ID
            const response = await axiosInstance.post('/api/EmployeeDetails/getEmployee', { employeeId });
            console.log('Employee details fetch successful. Response:', response);
            return response.data;
        } catch (error) {
            console.error('Employee details fetch failed. Error:', error);
            return rejectWithValue(error.response?.data || 'Error fetching employee details');
        }
    }
);

// Async thunk to check the current password before updating the password
export const checkPassword = createAsyncThunk(
    'employeeDetail/checkPassword', // Action type
    async (passwordData, { rejectWithValue }) => {
        try {
            // Payload for checking the current password
            const payload = {
                currentPassword: passwordData.currentPassword, // The current password entered by the user
                Id: passwordData.userId, // The user ID for whom the password is being checked
            };

            // API call to check the current password
            const response = await axiosInstance.post('/api/EmployeeDetails/checkPassword', payload);
            console.log('Password check successful. Response:', response);

            // Return the API response which indicates if the password is correct
            return response.data;
        } catch (error) {
            console.error('Password check failed:', error);

            // Reject the promise with the error message to be captured by the component
            return rejectWithValue(error.response?.data || 'Password check failed');
        }
    }
);

// Async thunk to update the user's password
export const updateNewPassword = createAsyncThunk(
    'employeeDetail/updateNewPassword', // Action type
    async (NewPasswordData, { rejectWithValue }) => {
        try {
            // Payload for updating the password
            const payload = {
                ...NewPasswordData, // Includes currentPassword, newPassword, and userId
            };

            // API call to update the password
            const response = await axiosInstance.put('/api/EmployeeDetails/updatePassword', payload);
            console.log('Password update successful. Response:', response);

            // Return the API response indicating successful password update
            return response.data;
        } catch (error) {
            console.error('Password update failed:', error);

            // Reject the promise with the error message to be captured by the component
            return rejectWithValue(error.response?.data || 'Password update failed');
        }
    }
);

// The slice for employee details including the state, reducers, and async thunks
const employeeDetailsSlice = createSlice({
    name: 'employeeDetails', // Slice name
    initialState, // Initial state for this slice
    reducers: {
        // Reducer to toggle the password reset form visibility
        setIsResetPasswordOpen: (state, action) => {
            state.isResetPasswordOpen = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // When fetchEmployeeDetails is pending (loading state)
            .addCase(fetchEmployeeDetails.pending, (state) => {
                state.status = 'loading';
                state.error = null; // Reset errors on new request
            })
            // When fetchEmployeeDetails is fulfilled (successful state)
            .addCase(fetchEmployeeDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.employeeDetails = action.payload; // Store the fetched employee details
            })
            // When fetchEmployeeDetails is rejected (failed state)
            .addCase(fetchEmployeeDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message; // Capture the error message
            })

            // When checkPassword is fulfilled (password match or mismatch state)
            .addCase(checkPassword.fulfilled, (state, action) => {
                state.passwordStatus = action.payload;  // Set password status from API response
            })
            // When checkPassword is rejected (password validation error state)
            .addCase(checkPassword.rejected, (state, action) => {
                state.passwordStatus = 'failed'; // Mark password check as failed
                state.error = action.payload || action.error.message; // Capture the error message
            })

            // When updateNewPassword is fulfilled (successful password update)
            .addCase(updateNewPassword.fulfilled, (state) => {
                state.passwordStatus = 'updated';  // Mark password update as successful
            })
            // When updateNewPassword is rejected (password update failure)
            .addCase(updateNewPassword.rejected, (state, action) => {
                state.passwordStatus = 'failed'; // Mark password update as failed
                state.error = action.payload || action.error.message; // Capture the error message
            });
    },
});

// Exporting the reducer actions
export const { setIsResetPasswordOpen } = employeeDetailsSlice.actions;

// Selectors to access specific state slices
export const selectEmployeeDetails = (state) => state.employeeDetails.employeeDetails;
export const selectIsResetPasswordOpen = (state) => state.employeeDetails.isResetPasswordOpen;

// Exporting the reducer as default
export default employeeDetailsSlice.reducer;
