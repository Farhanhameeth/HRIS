import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosConfig';

// --- Async Thunk: Fetch employees under a report person ---
export const fetchEmployeesByReportPerson = createAsyncThunk(
  'kpi/fetchEmployeesByReportPerson',
  async (reportPersonId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/ReportPersonDetails/getEmployeesByReportPerson/${reportPersonId}`);
      // assuming API returns array of { employeeId }
      return response.data.map(emp => emp.employeeId);
    } catch (error) {
      console.error("Error fetching employees by report person:", error);
      return rejectWithValue(error.response?.data || 'Failed to fetch employees');
    }
  }
);

// --- Initial State ---
const initialState = {
  reportPersonEmployees: [],
  reportPersonStatus: 'idle',
  reportPersonError: null,

  kpiSet: [],
  complianceSet: [],
  trainingSet: [],

  status: 'idle',
  error: null,
};

// --- Slice ---
const kpiSlice = createSlice({
  name: 'kpi',
  initialState,
  reducers: {
    addKpiToSet: (state, action) => {
      state.kpiSet.push(action.payload);
    },
    addComplianceToSet: (state, action) => {
      state.complianceSet.push(action.payload);
    },
    addTrainingToSet: (state, action) => {
      state.trainingSet.push(action.payload);
    },
    clearKpiData: (state) => {
      state.kpiSet = [];
      state.complianceSet = [];
      state.trainingSet = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeesByReportPerson.pending, (state) => {
        state.reportPersonStatus = 'loading';
      })
      .addCase(fetchEmployeesByReportPerson.fulfilled, (state, action) => {
        state.reportPersonStatus = 'succeeded';
        state.reportPersonEmployees = action.payload;
      })
      .addCase(fetchEmployeesByReportPerson.rejected, (state, action) => {
        state.reportPersonStatus = 'failed';
        state.reportPersonError = action.payload;
      });
  }
});

// --- Exports ---
export const {
  addKpiToSet,
  addComplianceToSet,
  addTrainingToSet,
  clearKpiData,
} = kpiSlice.actions;

export const selectReportPersonEmployees = (state) => state.kpi.reportPersonEmployees;
export const selectKpiSet = (state) => state.kpi.kpiSet;
export const selectComplianceSet = (state) => state.kpi.complianceSet;
export const selectTrainingSet = (state) => state.kpi.trainingSet;

export default kpiSlice.reducer;
