
// src/features/resource/resourceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosConfig';

const initialState = {
  resources: [],
  resourceTypes: [],
  unitNames: [],
  employees: [],
  status: 'idle',
  error: null,
  selectedRecord: null,
  isModalOpen: false,
  isUpdateModalOpen: false,
  isNewRecordOpen: false,
  filters: {
    searchBy: 'Id',
    status: 'all',
    id: '',
    serialNo: '',
    resourceTypeId: '',
    warrantyStartDate: '',
    warrantyEndDate: '',
    price: '',
    unitId: '',
    maintainBy: '',
    brand: '',
    updateDate: '',
    updateBy: '',
    insertDate: '',
    insertBy: '',
    isActive: '',
    employeeId: ''
  },
  currentPage: 1,
  itemsPerPage: 10,
};

export const fetchResources = createAsyncThunk(
  'resource/fetchResources',
  async () => {
    try {
      const response = await axiosInstance.post('/api/ResourceDetails/getAllResources', {});
      console.log('Request successful. Response:', response);
      return response.data;
    } catch (error) {
      console.error('Request failed. Error:', error);
      throw error;
    }
  }
);

export const fetchAllResourceTypes = createAsyncThunk(
  'resource/fetchAllResourceTypes',
  async () => {
    try {
      const response = await axiosInstance.post('/api/ResourceTypeDetails/getAllResourceTypes', {});
      console.log('Request successful. Response:', response);
      return response.data;
    } catch (error) {
      console.error('Request failed. Error:', error);
      throw error;
    }
  }
);

export const fetchAllUnitNames = createAsyncThunk(
  'resource/fetchAllUnitNames',
  async () => {
    try {
      const response = await axiosInstance.post('/api/UnitDetails/getAllUnitNames', {});
      console.log('Request successful. Response:', response);
      return response.data;
    } catch (error) {
      console.error('Request failed. Error:', error);
      throw error;
    }
  }
);

export const fetchAllEmployees = createAsyncThunk(
  'resource/fetchAllEmployees',
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

export const submitNewResource = createAsyncThunk(
  'resource/submitPayrollRecord',
  async (NewResourceData, { rejectWithValue }) => {
    try {
     
      const payload = {
        ...NewResourceData,

      };
      
      const response = await axiosInstance.post('/api/ResourceDetails/insertNewResource', payload);
      return response.data;
    } catch (error) {
      console.error('Resource submission failed:', error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateResource = createAsyncThunk(
  'resource/updateResource',
  async (UpdateResourceData, { rejectWithValue }) => {
    try {
     
      const payload = {
        ...UpdateResourceData,

      };
      
      const response = await axiosInstance.put('/api/ResourceDetails/updateResourceDetails', payload);
      console.log('Update successfull', response.data);
      return response.data;
    } catch (error) {
      console.error('Resource update failed:', error);
      return rejectWithValue(error.response.data);
    }
  }
);

const resourceSlice = createSlice({
  name: 'resource',
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
    setResources: (state, action) => {
      state.resources = action.payload;
    },
    addResource: (state, action) => {
      state.resources.push(action.payload);
    },
    selectResources: (state) => state.resources,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResources.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.resources = action.payload;
      })
      .addCase(fetchAllResourceTypes.fulfilled, (state, action) => { // Correctly updating employees state
        state.status = 'succeeded';
        state.resourceTypes = action.payload;
      })
      .addCase(fetchAllUnitNames.fulfilled, (state, action) => { // Correctly updating employees state
        state.status = 'succeeded';
        state.unitNames = action.payload;
      })
      .addCase(fetchAllEmployees.fulfilled, (state, action) => { // Correctly updating employees state
        state.status = 'succeeded';
        state.employees = action.payload;
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const {
  setSelectedRecord,
  setIsModalOpen,
  setIsUpdateModalOpen,
  setIsNewRecordOpen,
  setFilters,
  setCurrentPage,
  setItemsPerPage,
  setResources,
  addResource,
} = resourceSlice.actions;

export const selectResources = (state) => state.resource.resources;
export const selectSelectedRecord = (state) => state.resource.selectedRecord;
export const selectIsModalOpen = (state) => state.resource.isModalOpen;
export const selectIsUpdateModalOpen = (state) => state.resource.isUpdateModalOpen;
export const selectIsNewRecordOpen = (state) => state.resource.isNewRecordOpen;

export default resourceSlice.reducer;
