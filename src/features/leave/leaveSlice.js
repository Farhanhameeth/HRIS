
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosConfig';

const initialState = {
  leaves: [],
  employees: [],
  leaveTypes: [],
  leaveCount: [],
  statusMapping: {
    'pending': 'pending',
    'approved': 'approved',
    'rejected': 'rejected'
  },
  selectedLeave: null,
  status: 'idle',
  error: null,
  isModalOpen: false,
  currentPage: 1,
  itemsPerPage: 10,
};

const hardcodedemployeeId = '100';

export const fetchAllEmployees = createAsyncThunk(
  'leave/fetchAllEmployees',
  async () => {
    try {
      const response = await axiosInstance.post('/api/EmployeeDetails/getAllEmployees', {});
      console.log('Request successful. Response:', response);
      return response.data;
    } catch (error) {
      console.error('Request failed. Error:', error);
      throw error;
    }
  }
);

export const fetchAllLeaveTypes = createAsyncThunk(
  'leave/fetchAllLeaveTypes',
  async () => {
    try {
      const response = await axiosInstance.post('/api/LeaveTypeDetails/getLeaveType', {});
      console.log('Request successful. Response:', response);
      return response.data;
    } catch (error) {
      console.error('Request failed. Error:', error);
      throw error;
    }
  }
);

export const fetchLeaves = createAsyncThunk(
  'leave/fetchLeaves',
  async () => {
    try {
      const response = await axiosInstance.post('/api/LeaveDetails/getLeaves', { employeeId: hardcodedemployeeId });
      return response.data;
    } catch (error) {
      console.error('Request failed. Error:', error);
      throw error;
    }
  }
);

export const getVisualLeaveData = createAsyncThunk(
  'leave/getVisualLeaveData',
  async (employeeId) => {
    try {
      const response = await axiosInstance.post('/api/LeaveDetails/getVisualLeaveData', { employeeId });
      console.log('Fetching employeewise leave successful. Response:', response);
      return response.data;
    } catch (error) {
      console.log('Fetching employeewise leave unsuccessful.');

      console.error('Request failed. Error:', error);
      throw error;
    }
  }
);


export const submitLeave = createAsyncThunk(
  'leave/submitLeave',
  async (leaveData, { rejectWithValue }) => {
    try {
      // Convert isFirstHalf and isSecondHalf to integers before sending to the backend
      // const payload = {
      //   ...leaveData,
      //   isFirstHalf: leaveData.isFirstHalf ? 1 : 0,
      //   isSecondHalf: leaveData.isSecondHalf ? 1 : 0
      // };
      const payload = {
        ...leaveData,
        isFirstHalf: !leaveData.isFirstHalf && !leaveData.isSecondHalf ? 1 : leaveData.isFirstHalf ? 1 : 0,
        isSecondHalf: !leaveData.isFirstHalf && !leaveData.isSecondHalf ? 1 : leaveData.isSecondHalf ? 1 : 0
      };
      
      const response = await axiosInstance.post('/api/LeaveDetails/insertLeave', payload);
      return response.data;
    } catch (error) {
      console.error('Leave submission failed:', error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateLeaveStatus = createAsyncThunk(
  'leave/updateLeaveStatus',
  async ({ Id, status, user }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put('/api/LeaveDetails/updateLeaveStatus', { Id, status, user });
      console.log('Leave status updated successfully:', response);
      return { Id, status, user };
    } catch (error) {
      console.error('Leave status update failed:', error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const sendEmail = createAsyncThunk(
  'leave/sendEmail',
  async (newEmail) => {
    try {
      console.log("newEmail object:", newEmail);
      const response = await axiosInstance.post('/api/EmergencyContactDetails/sendEmail', newEmail);
      return response.data; // Return server's response data
    } catch (error) {
      console.error('Email send failed:', error);
      return rejectWithValue(error.response?.data || 'Failed to send email');
    }
  }
);

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    addLeave: (state, action) => {
      state.leaves.push(action.payload);
    },
    setSelectedLeave: (state, action) => {
      state.selectedLeave = action.payload;
    },
    setIsModalOpen: (state, action) => {
      state.isModalOpen = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLeaves.fulfilled, (state, action) => {
      const fetchedLeaves = action.payload.map((leave, index) => ({
        ...leave,
        Id: state.leaves.length + index + 1,
      }));
      state.leaves = fetchedLeaves;
    });
    builder.addCase(submitLeave.fulfilled, (state, action) => {
      state.leaves.push(action.payload);
    });
    // builder.addCase(sendEmail.fulfilled, (state, action) => {
    //   state.leaves.push(action.payload);
    // });
    builder.addCase(fetchAllEmployees.fulfilled, (state, action) => { // Correctly updating employees state
      state.status = 'succeeded';
      state.employees = action.payload;
    });
    builder.addCase(fetchAllLeaveTypes.fulfilled, (state, action) => { // Correctly updating employees state
      state.status = 'succeeded';
      state.leaveTypes = action.payload;
    });
    builder.addCase(getVisualLeaveData.fulfilled, (state, action) => { 
      state.status = 'succeeded';
      state.leaveCount = action.payload;
    });
    builder.addCase(updateLeaveStatus.fulfilled, (state, action) => {
      const { Id, status, user } = action.payload;
      const updateLeave = (leave) => {
        if (leave.Id === Id) {
          leave.status = status;
          leave.user = user;
          leave.status = state.statusMapping[status]; // Update the status name based on mapping
        }
      };
      state.leaves.forEach(updateLeave);
     // state.receivedGrievances.forEach(updateGrievance);
    });
  },
});

export const { addLeave, setSelectedLeave, setIsModalOpen, setCurrentPage, setItemsPerPage } = leaveSlice.actions;
export const selectIsModalOpen = (state) => state.leave.isModalOpen;

export default leaveSlice.reducer;
