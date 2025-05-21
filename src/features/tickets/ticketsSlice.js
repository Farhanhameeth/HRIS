
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosConfig';

const initialState = {
  tickets: [],
  
  statusMapping: {
    0: 'Set Status',
    1: 'Open',
    2: 'In Progress',
    3: 'On Hold',
    4: 'Closed',
    5: 'Reopened',
    6: 'Resolved',
    7: 'Cancelled',
    8: 'Awaiting Info',
    9: 'Completed'
  },
  
  selectedTicket: null,
  chatHistory: [],
  chatMessage: '', // New state to hold the chat message input
  feedbackRating: 0,
  currentPage: 1,
  itemsPerPage: 10,
};

const hardcodedemployeeId = '100';

export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async () => {
    try {
      const response = await axiosInstance.post('/api/TicketDetails/getTicketDetails', { employeeId: hardcodedemployeeId });
      console.log('Request successful. Response:', response);
      return response.data;
    } catch (error) {
      console.error('Request failed. Error:', error);
      throw error;
    }
  }
);

export const submitTicket = createAsyncThunk(
  'tickets/submitTicket',
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

export const updateTicketStatus = createAsyncThunk(
  'tickets/updateTicketStatus',
  async ({ TicketNumber, statusId }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const statusName = state.tickets.statusMapping[statusId];
      const response = await axiosInstance.put('/api/TicketDetails/updateTicketStatus', { TicketNumber, statusId });
      console.log('Ticket status updated successfully:', response);
      return { TicketNumber, statusId: statusName };
    } catch (error) {
      console.error('Ticket status update failed:', error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchTicketComments = createAsyncThunk(
  'tickets/fetchTicketComments',
  async (ticketId) => { // Accept ticketId as a parameter
    try {
      const response = await axiosInstance.post('/api/TicketCommentDetails/getTicketComment', { ticketId});
      console.log('Fetching ticket comments successful. Response:', response);
      return response.data;
    } catch (error) {
      console.error('Fetching ticket comments failed:', error);
      throw error;
    }
  }
);

export const submitTicketComment = createAsyncThunk(
  'tickets/submitTicketComment',
  async ({ ticketId, comment, insertBy }, { rejectWithValue }) => { // Accept grievanceId and comment as parameters
    // const hardcodedInsertBy = 1; // Hardcoded insertBy value
    try {
      const response = await axiosInstance.post('/api/TicketCommentDetails/insertTicketComment', {
        ticketId,
        comment,
        insertBy
      });
      console.log('Submitting ticket comments successful. Response:', response);
      return response.data;
    } catch (error) {
      console.error('Submitting ticket comment failed:', error);
      return rejectWithValue(error.response.data);
    }
  }
);

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    addTicket: (state, action) => {
      const newTicket = action.payload;
      state.tickets.push(newTicket);
    
    },
    setSelectedTicket: (state, action) => {
      state.selectedTicket = action.payload;
    },
    setChatMessage: (state, action) => {
      state.chatMessage = action.payload;
    },
    addChatMessage: (state, action) => {
      state.chatHistory.push(action.payload);
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
    },
    setFeedbackRating: (state, action) => {
      state.feedbackRating = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTickets.fulfilled, (state, action) => {
      const fetchedTickets = action.payload.map((ticket, index) => ({
        ...ticket,
        TicketNumber: state.tickets.length + index + 1,
      }));
      state.tickets = fetchedTickets;
    });
    builder.addCase(submitTicket.fulfilled, (state, action) => {
      state.tickets.push(action.payload);
    });
    builder.addCase(fetchTicketComments.fulfilled, (state, action) => {
      state.chatHistory = action.payload;
    });
    builder.addCase(submitTicketComment.fulfilled, (state, action) => {
      console.log('Ticket comment submitted successfully');
    });
    builder.addCase(updateTicketStatus.fulfilled, (state, action) => {
      const { TicketNumber, statusId } = action.payload;
      const updateTicket = (ticket) => {
        if (ticket.TicketNumber === TicketNumber) {
            ticket.statusId = statusId; // Update the status name based on mapping
        }
      };
      state.tickets.forEach(updateTicket);
    });

  },
});

export const {
  addTicket,
  setSelectedTicket,
  setChatMessage,
  addChatMessage,
  setFeedbackRating,
  setCurrentPage,
  setItemsPerPage,
} = ticketsSlice.actions;

export default ticketsSlice.reducer;

