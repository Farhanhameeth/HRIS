import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loanDetails: [],
    selectedRecord: null,
    isModalOpen: false,
    filters: {
        id: '',
        employeeId: '',
        firstName: '',
        lastName: '',
        installmentType: '',
        interestRate: '',
        loanAmount: '',
        purpose: '',
        financeApproveBy: '',
        hrApproveBy: '',
        rejectBy: '',
        reference: '',
        searchBy: 'firstName',
    },
    currentPage: 1,
    itemsPerPage: 10,
}

const loanSlice = createSlice({
  name: 'loan',
  initialState,
  reducers: {
      setLoanDetails: (state, action) => {
        state.loanDetails = action.payload;
      },
      setSelectedRecord: (state, action) => {
        state.selectedRecord = action.payload;
      },
      setIsModalOpen: (state, action) => {
        state.isModalOpen = action.payload;
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
  }
});

export const {
    setLoanDetails,
    setSelectedRecord,
    setIsModalOpen,
    setFilters,
    setCurrentPage,
    setItemsPerPage,
} = loanSlice.actions;

export default loanSlice.reducer;
