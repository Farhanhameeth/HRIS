
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosConfig';

const initialState = {
  grievances: [],
  receivedGrievances: [],
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
  
  selectedGrievance: null,
  chatHistory: [],
  chatMessage: '', // New state to hold the chat message input
  feedbackRating: 0,
  currentPage: 1,
  itemsPerPage: 10,
};

const hardcodedemployeeId = '100';

export const fetchGrievances = createAsyncThunk(
  'grievances/fetchGrievances',
  async () => {
    try {
      const response = await axiosInstance.post('/api/GrievanceDetails/getGrievance', { employeeId: hardcodedemployeeId });
      console.log('Request successful. Response:', response);
      return response.data;
    } catch (error) {
      console.error('Request failed. Error:', error);
      throw error;
    }
  }
);

export const submitGrievance = createAsyncThunk(
  'grievances/submitGrievance',
  async (grievanceData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/GrievanceDetails/insertGrievance', grievanceData);
      console.log('Grievance submitted successfully:', response);
      return response.data;
    } catch (error) {
      console.error('Grievance submission failed:', error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateGrievanceStatus = createAsyncThunk(
  'grievances/updateGrievanceStatus',
  async ({ GrievanceNumber, statusId }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const statusName = state.grievances.statusMapping[statusId];
      const response = await axiosInstance.put('/api/GrievanceDetails/updateGrievanceStatus', { GrievanceNumber, statusId });
      console.log('Grievance status updated successfully:', response);
      return { GrievanceNumber, statusId: statusName };
    } catch (error) {
      console.error('Grievance status update failed:', error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchGrievanceComments = createAsyncThunk(
  'grievances/fetchGrievanceComments',
  async (grievanceId) => { // Accept grievanceId as a parameter
    try {
      const response = await axiosInstance.post('/api/GrievanceCommentDetails/getGrievanceComment', { grievanceId});
      console.log('Fetching grievance comments successful. Response:', response);
      return response.data;
    } catch (error) {
      console.error('Fetching grievance comments failed:', error);
      throw error;
    }
  }
);

export const submitGrievanceComment = createAsyncThunk(
  'grievances/submitGrievanceComment',
  async ({ grievanceId, comment, insertBy }, { rejectWithValue }) => { // Accept grievanceId and comment as parameters
    // const hardcodedInsertBy = 1; // Hardcoded insertBy value
    try {
      const response = await axiosInstance.post('/api/GrievanceCommentDetails/insertGrievanceComment', {
        grievanceId,
        comment,
        insertBy
      });
      console.log('Submitting grievance comments successful. Response:', response);
      return response.data;
    } catch (error) {
      console.error('Submitting grievance comment failed:', error);
      return rejectWithValue(error.response.data);
    }
  }
);

const grievancesSlice = createSlice({
  name: 'grievances',
  initialState,
  reducers: {
    addGrievance: (state, action) => {
      const newGrievance = action.payload;
      state.grievances.push(newGrievance);
      state.receivedGrievances.push({
        ...newGrievance,
        employeeNumber: 'E' + (state.grievances.length + 1).toString().padStart(3, '0'),
        department: 'Unknown',
      });
    },
    setSelectedGrievance: (state, action) => {
      state.selectedGrievance = action.payload;
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
    builder.addCase(fetchGrievances.fulfilled, (state, action) => {
      const fetchedGrievances = action.payload.map((grievance, index) => ({
        ...grievance,
        GrievanceNumber: state.grievances.length + index + 1,
      }));
      state.grievances = fetchedGrievances;
    });
    builder.addCase(submitGrievance.fulfilled, (state, action) => {
      state.grievances.push(action.payload);
    });
    builder.addCase(fetchGrievanceComments.fulfilled, (state, action) => {
      state.chatHistory = action.payload;
    });
    builder.addCase(submitGrievanceComment.fulfilled, (state, action) => {
      console.log('Grievance comment submitted successfully');
    });
    builder.addCase(updateGrievanceStatus.fulfilled, (state, action) => {
      const { GrievanceNumber, statusId } = action.payload;
      const updateGrievance = (grievance) => {
        if (grievance.GrievanceNumber === GrievanceNumber) {
          grievance.statusId = statusId; // Update the status name based on mapping
        }
      };
      state.grievances.forEach(updateGrievance);
      
    });
    
  },
});

export const {
  addGrievance,
  setSelectedGrievance,
  setChatMessage,
  addChatMessage,
  setFeedbackRating,
  setCurrentPage,
  setItemsPerPage,
} = grievancesSlice.actions;

export default grievancesSlice.reducer;

