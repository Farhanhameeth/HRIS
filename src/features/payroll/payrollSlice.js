// src/features/payroll/payrollSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosConfig';

const initialState = {
  payrolls: [],
  payrollRecords: [],
  employees: [], // Correct state for employees
  empIDs: [],
  allowanceTypes: [],
  deductionTypes: [],
  isActive: [],
  status: 'idle',
  error: null,
  payrollDetails: [],
  selectedRecord: null,
  isModalOpen: false,
  isNewRecordOpen: false,
  filters: {
    payrollId: '',
    EmployeeId: '',
    Name: '',
    BaseSalary: '',
    EPF: '',
    ETF: '',
    DeductionAmount: '',
    AllowanceAmount: '',
    status: 'all',
    searchBy: 'payrollId',
    isActive: '',
    // month: new Date().toLocaleString('default', { month: 'long' }),
    // year: new Date().getFullYear().toString(),
    month: '',
    year: '',
  },
  currentPage: 1,
  itemsPerPage: 10,
  selectedRecord: null,
};

const hardcodedemployeeId = '100';

// Async thunk to fetch payrolls from API
export const fetchPayrolls = createAsyncThunk(
  'payroll/fetchPayrolls',
  async () => {
    try {
      const response = await axiosInstance.post('/api/PayrollDetails/getPayroll', { employeeId: hardcodedemployeeId });
      console.log('Request successful. Response:', response);
      return response.data;
    } catch (error) {
      console.error('Request failed. Error:', error);
      throw error;
    }
  }
);

export const fetchAllEmployees = createAsyncThunk(
  'payroll/fetchAllEmployees',
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

export const fetchAllAllowanceTypes = createAsyncThunk(
  'payroll/fetchAllAllowanceTypes',
  async () => {
    try {
      const response = await axiosInstance.post('/api/AllowanceTypeDetails/getAllAllowanceTypes', {});
      console.log('Request successful. Response:', response);
      return response.data;
    } catch (error) {
      console.error('Request failed. Error:', error);
      throw error;
    }
  }
);

export const fetchAllDeductionTypes = createAsyncThunk(
  'payroll/fetchAllDeductionTypes',
  async () => {
    try {
      const response = await axiosInstance.post('/api/DeductionTypeDetails/getAllDeductionTypes', {});
      console.log('Request successful. Response:', response);
      return response.data;
    } catch (error) {
      console.error('Request failed. Error:', error);
      throw error;
    }
  }
);

export const getActiveEMP = createAsyncThunk(
  'payroll/getActiveEMP',
  async () => {
    try {
      const response = await axiosInstance.post('/api/EmployeeDetails/getActiveEMP', {});
      console.log('Request successful. Response:', response);
      return response.data;
    } catch (error) {
      console.error('Request failed. Error:', error);
      throw error;
    }
  }
);


export const submitPayrollRecord = createAsyncThunk(
  'payroll/submitPayrollRecord',
  async (payrollRecordData, { rejectWithValue }) => {
    try {
     
      const payload = {
        ...payrollRecordData,
        // isFirstHalf: !leaveData.isFirstHalf && !leaveData.isSecondHalf ? 1 : leaveData.isFirstHalf ? 1 : 0,
        // isSecondHalf: !leaveData.isFirstHalf && !leaveData.isSecondHalf ? 1 : leaveData.isSecondHalf ? 1 : 0
      };
      
      const response = await axiosInstance.post('/api/PayrollDetails/insertPayrollRecord', payload);
      console.log('Request successful. Response:', response);
      return response.data;
    } catch (error) {
      console.error('Payroll submission failed:', error);
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchAllPayrolls = createAsyncThunk(
  'payroll/fetchAllPayrolls',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/PayrollDetails/getAllPayrolls');
      console.log('Payroll Records fetched successfully:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching Payroll Records:', error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const updatePayrollPopup = createAsyncThunk(
  'payroll/updatePayrollPopup',
  async (updatedRecord, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put('/api/PayrollDetails/updatePayrollPopup', updatedRecord);
      console.log('Update successful:', response);
      return response.data;
    } catch (error) {
      console.error('Update failed:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



export const calculatePayrollRecord = createAsyncThunk(
  'payroll/calculatePayrollRecord',
  async (payrollRecordData, { rejectWithValue }) => {
    try {
     
      const payload = {
        ...payrollRecordData,
        
      };
      
      const response = await axiosInstance.post('/api/PayrollDetails/calculatePayroll', payload);
      console.log('Request successful. Response:', response);
      setPayrollRecords(response.data); // Store the data in Redux
      return response.data;
    } catch (error) {
      console.error('Payroll submission failed:', error);
      return rejectWithValue(error.response.data);
    }
  }
);

const payrollSlice = createSlice({
  name: 'payroll',
  initialState,
  reducers: {
    setSelectedRecord: (state, action) => {
      state.selectedRecord = action.payload;
    },
    setPayrollRecords: (state, action) => {
      state.payrollRecords = action.payload; // Set fetched payroll records
    },
    setIsModalOpen: (state, action) => {
      state.isModalOpen = action.payload;
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
    setPayrolls: (state, action) => {
      state.payrolls = action.payload;
    },
    addPayroll: (state, action) => {
      state.payrolls.push(action.payload);
    },
    selectPayrolls: (state) => state.payrolls,
  },
  extraReducers: (builder) => {
    builder
      .addCase(calculatePayrollRecord.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(calculatePayrollRecord.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.payrolls = action.payload;
      })
      .addCase(fetchAllEmployees.fulfilled, (state, action) => { // Correctly updating employees state
        state.status = 'succeeded';
        state.employees = action.payload;
      })
      .addCase(getActiveEMP.fulfilled, (state, action) => { // Correctly updating employees state
        state.status = 'succeeded';
        state.empIDs = action.payload;
      })
      .addCase(fetchAllAllowanceTypes.fulfilled, (state, action) => { // Correctly updating employees state
        state.status = 'succeeded';
        state.allowanceTypes = action.payload;
      })
      .addCase(fetchAllDeductionTypes.fulfilled, (state, action) => { // Correctly updating employees state
        state.status = 'succeeded';
        state.deductionTypes = action.payload;
      })
      .addCase(calculatePayrollRecord.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchPayrolls.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPayrolls.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.payrolls = action.payload;
      })
      .addCase(fetchPayrolls.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updatePayrollPopup.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(updatePayrollPopup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

  },
});

export const {
  setSelectedRecord,
  setIsModalOpen,
  setIsNewRecordOpen,
  setFilters,
  setCurrentPage,
  setItemsPerPage,
  setPayrollRecords,
  setPayrolls,
  addPayroll,
} = payrollSlice.actions;

export const selectPayrolls = (state) => state.payroll.payrolls;
export const selectSelectedRecord = (state) => state.payroll.selectedRecord;
export const selectIsModalOpen = (state) => state.payroll.isModalOpen;
export const selectIsNewRecordOpen = (state) => state.payroll.isNewRecordOpen;

export default payrollSlice.reducer;


