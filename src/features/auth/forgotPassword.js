
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from '../../config/axiosConfig';

const initialState = {
    secQuestions: [],  
    forgotPassword: [],  
    status: 'idle',
    error: null,
    isForgotPasswordOpen: false,
    isTypeEmailOpen: false,
    currentPage: 1,
    itemsPerPage: 10,
};

// Updated to accept email as a parameter
export const fetchEmailwiseSecurityQuestions = createAsyncThunk(
    'forgotPassword/fetchEmailwiseSecurityQuestions',
    async (email) => {  // Accept the email from the component
        try {
            const response = await axiosInstance.post('/api/EmployeewiseSecurityQuestion/getEmailwiseSecurityQuestion', { email });
            console.log('Request successful. Response:', response);
            return response.data;
        } catch (error) {
            console.error('Request failed. Error:', error);
            throw error;
        }
    }
);

export const submitTicket = createAsyncThunk(
    'forgotPassword/submitTicket',
    async (ticketData, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post('/api/TicketDetails/insertTicket', ticketData);
        console.log('Ticket submitted successfully:', response);
        return response.data;
      } catch (error) {
        console.error('Ticket submission failed:', error);
        return rejectWithValue(error.response.data);
      }
    }
  );

export const forgotPasswordSlice = createSlice({
    name: "forgotPassword",
    initialState,
    reducers: {
        addTicket: (state, action) => {
            const newTicket = action.payload;
            state.forgotPassword.push(newTicket);
          
          },
        setIsForgotPasswordOpen: (state, action) => {
            state.isForgotPasswordOpen = action.payload;
        },
        setIsTypeEmailOpen: (state, action) => {
            state.isTypeEmailOpen = action.payload;
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        setItemsPerPage: (state, action) => {
            state.itemsPerPage = action.payload;
        },
        setSecQuestions: (state, action) => {
            state.secQuestions = action.payload;
        },
        addSecQuestion: (state, action) => {
            state.secQuestions.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmailwiseSecurityQuestions.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchEmailwiseSecurityQuestions.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.secQuestions = action.payload;
            })
            .addCase(submitTicket.fulfilled, (state, action) => {
                state.forgotPassword.push(action.payload);
              })
            .addCase(fetchEmailwiseSecurityQuestions.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export const {  
    addTicket,
    setIsForgotPasswordOpen,
    setIsTypeEmailOpen,
    setCurrentPage,
    setItemsPerPage,
    setSecQuestions,
    addSecQuestion, 
} = forgotPasswordSlice.actions;

export const selectSecQuestions = (state) => state.forgotPassword.secQuestions;
export const selectIsForgotPasswordOpen = (state) => state.forgotPassword.isForgotPasswordOpen;
export const selectIsTypeEmailOpen = (state) => state.forgotPassword.isTypeEmailOpen;


export default forgotPasswordSlice.reducer;

