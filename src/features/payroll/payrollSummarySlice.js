
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosConfig';
// import {
//   fetchPayrollSummaries,
//   selectPayrollSummaries,
//   setFilters,
//   setSelectedRecord,
//   setCurrentPage,
//   setItemsPerPage,
// } from '../../features/payroll/payrollSummarySlice';

const initialState = {
  payrollSummaries: [],
  status: 'idle',
  error: null,
  payrollSummaryDetails: [],
  filters: {
    TotalEmployeesCount: '',
    CountOfEmployeesToBePaid: '',
    ExpectedTotalAmountToPay: '',
    TotalDeductionAmount: '',
    TotalAllowanceAmount: '',
    TotalEpfAmount: '',
    TotalEtfAmount: '',
    TotalPayeeTaxAmount: '',
    ActualTotalAmountToPay: '',
    status: 'all',
    searchBy: 'TotalEmployeesCount',
    // month: '',
    // year: '',
    month: new Date().toLocaleString('default', { month: 'long' }), // Current month
    year: new Date().getFullYear().toString(), // Current year
  },
  currentPage: 1,
  itemsPerPage: 10,
  selectedRecord: null,
};
// const hardcodedemployeeId = '2024-08-01';


export const fetchPayrollSummaries = createAsyncThunk(
  'payrollSummary/fetchPayrollSummaries',
  async ({ year, month }) => {
    try {
      const monthIndex = new Date(`${month} 1, ${year}`).getMonth() + 1;
      const formattedMonth = monthIndex < 10 ? `0${monthIndex}` : monthIndex;
      const insertYearMonth = `${year}-${formattedMonth}-01`; // Use dummy '01' for the day
      // const insertYearMonth = '2024-08-01'; // Use dummy '01' for the day
      const response = await axiosInstance.post('/api/PayrollDetails/getPayrollSummary', { insertYearMonth });
      console.log('Request successful. Response:', response);
      return response.data; // Wrap the single object in an array
    } catch (error) {
      console.error('Request failed. Error:', error);
      throw error;
    }
  }
);



const payrollSummarySlice = createSlice({
  name: 'payrollSummary',
  initialState,
  reducers: {
    setSelectedRecord: (state, action) => {
      state.selectedRecord = action.payload;
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
    setPayrollSummaries: (state, action) => {
      state.payrollSummaries= action.payload; // Assuming action.payload is an array of payrolls
    },
    addPayrollSummary: (state, action) => {
      state.payrollSummaries.push(action.payload);
    },
    selectPayrollSummaries: (state) => state.payrollSummaries,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayrollSummaries.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPayrollSummaries.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.payrollSummaries = action.payload;
      })
      .addCase(fetchPayrollSummaries.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const {
  setPayrollSummaryDetails,
  setSelectedRecord,
  setFilters,
  setCurrentPage,
  setItemsPerPage,
  setPayrollSummaries, addPayrollSummary
} = payrollSummarySlice.actions;

export const selectPayrollSummaries = (state) => state.payrollSummary.payrollSummaries;
export const selectSelectedRecord = (state) => state.payrollSummary.selectedRecord;

export default payrollSummarySlice.reducer;