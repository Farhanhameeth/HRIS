
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosConfig';

const initialState = {
  employeeRecords: [],
  employees: [],
  allowanceTypes: [],
  unitNames: [],
  countryNames: [],
  departments: [],
  contractTypes: [],
  roles: [],
  leaveTypes: [],
  status: 'idle',
  error: null,
  selectedRecord: null,
  isModalOpen: false,
  isUpdateModalOpen: false,
  isNewRecordOpen: false,
  isSetLeavesModalOpen: false,
  isSetSalaryModalOpen: false,
  isSetAllowanceModalOpen: false,

  filters: {
    searchBy: 'Id',
    status: 'all',
    id: '',
    employeeId: '',
    firstName: '',
    lastName: '',
    department: '',
    contractType: '',
    unit: '',
    role: '',
  },
  currentPage: 1,
  itemsPerPage: 10,
};

export const fetchEmployeeRecords = createAsyncThunk(
  'database/fetchEmployeeRecords',
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

export const fetchAllUnitNames = createAsyncThunk(
  'database/fetchAllUnitNames',
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

export const fetchAllCountryNames = createAsyncThunk(
  'database/fetchAllCountryNames',
  async () => {
    try {
      const response = await axiosInstance.post('/api/CountryDetails/getAllCountryNames', {});
      console.log('Request successful. Response:', response);
      return response.data;
    } catch (error) {
      console.error('Request failed. Error:', error);
      throw error;
    }
  }
);

export const fetchAllDepartments = createAsyncThunk(
  'database/fetchAllDepartments',
  async () => {
    try {
      const response = await axiosInstance.post('/api/DepartmentDetails/getAllDepartments', {});
      console.log('Request successful. Response:', response);
      return response.data;
    } catch (error) {
      console.error('Request failed. Error:', error);
      throw error;
    }
  }
);

export const fetchAllContractTypes = createAsyncThunk(
  'database/fetchAllContractTypes',
  async () => {
    try {
      const response = await axiosInstance.post('/api/ContractTypeDetails/getAllContractTypes', {});
      console.log('Request successful. Response:', response);
      return response.data;
    } catch (error) {
      console.error('Request failed. Error:', error);
      throw error;
    }
  }
);

export const fetchAllRoles = createAsyncThunk(
  'database/fetchAllRoles',
  async () => {
    try {
      const response = await axiosInstance.post('/api/RoleDetails/getAllRoles', {});
      console.log('Request successful. Response:', response);
      return response.data;
    } catch (error) {
      console.error('Request failed. Error:', error);
      throw error;
    }
  }
);

export const fetchAllEmployees = createAsyncThunk(
  'database/fetchAllEmployees',
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
  'database/fetchAllLeaveTypes',
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

export const fetchAllAllowanceTypes = createAsyncThunk(
  'database/fetchAllAllowanceTypes',
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

export const insertNewEmployee = createAsyncThunk(
  'database/insertNewEmployee',
  async (NewEmployeeData, { rejectWithValue }) => {
    try {
     
      const payload = {
        ...NewEmployeeData,

      };
      
      const response = await axiosInstance.post('/api/EmployeeDetails/insertNewEmployee', payload);
      return response.data;
    } catch (error) {
      console.error('Employee insertion failed:', error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'database/updateEmployee',
  async (UpdateEmployeeData, { rejectWithValue }) => {
    try {
     
      const payload = {
        ...UpdateEmployeeData,

      };
      
      const response = await axiosInstance.put('/api/EmployeeDetails/updateEmployee', payload);
      console.log('Update successfull', response.data);
      return response.data;
    } catch (error) {
      console.error('Employee update failed:', error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const setEmployeewiseLeave = createAsyncThunk(
  'database/setEmployeewiseLeave',
  async (employeewiseLeaveData, { rejectWithValue }) => {
    try {
     
      const payload = {
        ...employeewiseLeaveData,

      };
      
      const response = await axiosInstance.post('/api/LeaveDetails/insertEmployeewiseLeave', payload);
      return response.data;
    } catch (error) {
      console.error('Leave insertion failed:', error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const setSalaryDetails = createAsyncThunk(
  'database/setSalaryDetails',
  async (setSalaryData, { rejectWithValue }) => {
    try {
     
      const payload = {
        ...setSalaryData,

      };
      
      const response = await axiosInstance.put('/api/SalaryDetails/setSalary', payload);
      console.log('Update successfull', response.data);
      return response.data;
    } catch (error) {
      console.error('Salary update failed:', error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const setAllowanceDetails = createAsyncThunk(
  'database/setAllowanceDetails',
  async (setAllowanceData, { rejectWithValue }) => {
    try {
     
      const payload = {
        ...setAllowanceData,

      };
      
      const response = await axiosInstance.put('/api/SalaryDetails/setAllowances', payload);
      console.log('Update successfull', response.data);
      return response.data;
    } catch (error) {
      console.error('Alowance update failed:', error);
      return rejectWithValue(error.response.data);
    }
  }
);

const databaseSlice = createSlice({
  name: 'database',
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
    setLeavesModalOpen: (state, action) => {
      state.isSetLeavesModalOpen = action.payload;
    },
    setSalaryModalOpen: (state, action) => {
      state.isSetSalaryModalOpen = action.payload;
    },
    setAllowanceModalOpen: (state, action) => {
      state.isSetAllowanceModalOpen = action.payload;
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
    setEmployeeRecords: (state, action) => {
      state.employeeRecords = action.payload;
    },
    addEmployeeRecord: (state, action) => {
      state.employeeRecords.push(action.payload);
    },
    selectEmployeeRecords: (state) => state.database,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeRecords.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchEmployeeRecords.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employeeRecords = action.payload;
      })
      .addCase(fetchAllUnitNames.fulfilled, (state, action) => { // Correctly updating employees state
        state.status = 'succeeded';
        state.unitNames = action.payload;
      })
      .addCase(fetchAllAllowanceTypes.fulfilled, (state, action) => { // Correctly updating employees state
        state.status = 'succeeded';
        state.allowanceTypes = action.payload;
      })
      .addCase(fetchAllCountryNames.fulfilled, (state, action) => { // Correctly updating employees state
        state.status = 'succeeded';
        state.countryNames = action.payload;
      })
      .addCase(fetchAllContractTypes.fulfilled, (state, action) => { // Correctly updating employees state
        state.status = 'succeeded';
        state.contractTypes = action.payload;
      })
      .addCase(fetchAllDepartments.fulfilled, (state, action) => { // Correctly updating employees state
        state.status = 'succeeded';
        state.departments = action.payload;
      })
      .addCase(fetchAllRoles.fulfilled, (state, action) => { // Correctly updating employees state
        state.status = 'succeeded';
        state.roles = action.payload;
      })
      .addCase(fetchAllEmployees.fulfilled, (state, action) => { // Correctly updating employees state
        state.status = 'succeeded';
        state.employees = action.payload;
      })
      .addCase(fetchAllLeaveTypes.fulfilled, (state, action) => { // Correctly updating employees state
        state.status = 'succeeded';
        state.leaveTypes = action.payload;
      })
      .addCase(fetchEmployeeRecords.rejected, (state, action) => {
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
  setLeavesModalOpen,
  setSalaryModalOpen,
  setAllowanceModalOpen,
  setFilters,
  setCurrentPage,
  setItemsPerPage,
  setEmployeeRecords,
  addEmployeeRecord,
} = databaseSlice.actions;

export const selectEmployeeRecords = (state) => state.database.employeeRecords;
export const selectSelectedRecord = (state) => state.database.selectedRecord;
export const selectIsModalOpen = (state) => state.database.isModalOpen;
export const selectIsUpdateModalOpen = (state) => state.database.isUpdateModalOpen;
export const selectIsNewRecordOpen = (state) => state.database.isNewRecordOpen;
export const selectIsSetLeavesModalOpen = (state) => state.database.isSetLeavesModalOpen;
export const selectIsSetSalaryModalOpen = (state) => state.database.isSetSalaryModalOpen;
export const selectIsSetAllowanceModalOpen = (state) => state.database.isSetAllowanceModalOpen;

export default databaseSlice.reducer;
