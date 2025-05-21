
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosConfig';

const initialState = {
  trainings: [],
  employees: [],
  reportTo: [],
  status: 'idle',
  error: null,
  trainingDetails: [],
  selectedRecord: null,
  isModalOpen: false,
  isUpdateModalOpen: false,
  isNewRecordOpen: false,
  filters: {
    status: 'all',
    id: '',
    employeeId: '',
    achieveId: '',
    firstName: '',
    lastName: '',
    courseName: '',
    trainingProvider: '',
    duration: '',
    cost: '',
    mode: '',
    priority: '',
    resources: '',
    searchBy: 'Id',
  },
  currentPage: 1,
  itemsPerPage: 10,
  selectedRecord: null,
};

const hardcodedId = 1;

// Async thunk to fetch payrolls from API
export const fetchTrainings = createAsyncThunk(
  'training/fetchTrainings',
  async () => {
    try {
      const response = await axiosInstance.post('/api/TrainingAndDevelopmentDetails/getTrainingAndDevelopmentDetails', { Id: hardcodedId });
      console.log('Request successful. Response:', response);
      return response.data;
    } catch (error) {
      console.error('Request failed. Error:', error);
      throw error;
    }
  }
);

export const fetchAllEmployees = createAsyncThunk(
  'training/fetchAllEmployees',
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

export const getReportPersonDetails = createAsyncThunk(
  'training/getReportPersonDetails',
  async () => {
    try {
      const response = await axiosInstance.post('/api/ReportPersonDetails/getReportPersonDetails', {});
      console.log('Request successful. Response:', response);
      return response.data;
    } catch (error) {
      console.error('Request failed. Error:', error);
      throw error;
    }
  }
);

export const submitNewTraining = createAsyncThunk(
  'training/submitNewTraining',
  async (NewTrainingData, { rejectWithValue }) => {
    try {
     
      const payload = {
        ...NewTrainingData,

      };
      
      const response = await axiosInstance.post('/api/TrainingAndDevelopmentDetails/insertTrainingAndDevelopmentDetails', payload);
      return response.data;
    } catch (error) {
      console.error('Training submission failed:', error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTraining = createAsyncThunk(
  'training/updateTraining',
  async (UpdateTrainingData, { rejectWithValue }) => {
    try {
     
      const payload = {
        ...UpdateTrainingData,

      };
      
      const response = await axiosInstance.put('/api/TrainingAndDevelopmentDetails/updateTrainingAndDevelopmentDetails', payload);
      console.log('Update successfull', response.data);
      return response.data;
    } catch (error) {
      console.error('Training update failed:', error);
      return rejectWithValue(error.response.data);
    }
  }
);


const trainingSlice = createSlice({
  name: 'training',
  initialState,
  reducers: {

    setSelectedRecord: (state, action) => {
      state.selectedRecord = action.payload;
    },
    setIsModalOpen: (state, action) => {
      state.isModalOpen = action.payload;
    },
    setIsUpdateModalOpen: (state, action) => {
      state.isUpdateModalOpen = action.payload;
    },
    setIsNewRecordOpen: (state, action) => {
      state.isNewRecordOpen = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
    },
    setTrainings: (state, action) => {
      state.trainings = action.payload;
    },
    addTraining: (state, action) => {
      state.trainings.push(action.payload);
    },
    selectTrainings: (state) => state.trainings,
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTrainings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.trainings = action.payload;
      })
      .addCase(fetchAllEmployees.fulfilled, (state, action) => { // Correctly updating employees state
        state.status = 'succeeded';
        state.employees = action.payload;
      })
      .addCase(getReportPersonDetails.fulfilled, (state, action) => { // Correctly updating employees state
        state.status = 'succeeded';
        state.reportTo = action.payload;
      })
      .addCase(fetchTrainings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },

});

export const {
  setTrainingDetails,
  setSelectedRecord,
  setIsModalOpen,
  setIsUpdateModalOpen,
  setIsNewRecordOpen,
  setFilters,
  setCurrentPage,
  setItemsPerPage,
  setTrainings, addTraining
} = trainingSlice.actions;

export const selectTrainings = (state) => state.training.trainings;
export const selectSelectedRecord = (state) => state.training.selectedRecord;
export const selectIsModalOpen = (state) => state.training.isModalOpen;
export const selectIsUpdateModalOpen = (state) => state.training.isUpdateModalOpen;
export const selectIsNewRecordOpen = (state) => state.training.isNewRecordOpen;


export default trainingSlice.reducer;
