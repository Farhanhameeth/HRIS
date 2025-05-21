
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {

  fetchEmployeeRecords,
  fetchAllUnitNames,
  fetchAllAllowanceTypes,
  fetchAllCountryNames,
  fetchAllDepartments,
  fetchAllContractTypes,
  fetchAllRoles,
  fetchAllEmployees,
  fetchAllLeaveTypes,
  insertNewEmployee,
  updateEmployee,
  setEmployeewiseLeave,
  setSalaryDetails,
  setAllowanceDetails,
  selectEmployeeRecords,
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
} from '../features/database/databaseSlice';
import { selectEmployeeId, selectUserId } from '../features/auth/authSlice';

const DatabasePage = () => {
  const dispatch = useDispatch();
  const employeeRecords = useSelector(selectEmployeeRecords);
  const status = useSelector(state => state.database.status);
  const error = useSelector(state => state.database.error);
  const filters = useSelector(state => state.database.filters);
  const currentPage = useSelector(state => state.database.currentPage);
  const itemsPerPage = useSelector(state => state.database.itemsPerPage);
  const isModalOpen = useSelector(state => state.database.isModalOpen);
  const isUpdateModalOpen = useSelector(state => state.database.isUpdateModalOpen);
  const isNewRecordOpen = useSelector(state => state.database.isNewRecordOpen);
  const isSetLeavesModalOpen = useSelector(state => state.database.isSetLeavesModalOpen);
  const isSetSalaryModalOpen = useSelector(state => state.database.isSetSalaryModalOpen);
  const isSetAllowanceModalOpen = useSelector(state => state.database.isSetAllowanceModalOpen);

  const selectedRecord = useSelector(state => state.database.selectedRecord);

  const employees = useSelector((state) => state.database.employees); // Adjust this according to your Redux state structure
  const [selectedEmployee, setSelectedEmployee] = useState('');
 
  const unitNames = useSelector((state) => state.database.unitNames); // Adjust this according to your Redux state structure
  const [selectedUnitName, setSelectedUnitName] = useState('');

  const countryNames = useSelector((state) => state.database.countryNames); // Adjust this according to your Redux state structure
  const [selectedCountryName, setSelectedCountryName] = useState('');

  const departments = useSelector((state) => state.database.departments); // Adjust this according to your Redux state structure
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const contractTypes = useSelector((state) => state.database.contractTypes); // Adjust this according to your Redux state structure
  const [selectedContractType, setSelectedContractType] = useState('');

  const roles = useSelector((state) => state.database.roles); // Adjust this according to your Redux state structure
  const [selectedRole, setSelectedRole] = useState('');

  const leaveTypes = useSelector((state) => state.database.leaveTypes); // Adjust this according to your Redux state structure
  const [selectedLeaveType, setSelectedLeaveType] = useState('');

  const allowanceTypes = useSelector((state) => state.database.allowanceTypes); // Adjust this according to your Redux state structure
  const [selectedAllowanceType, setSelectedAllowanceType] = useState('');

  const [employeeId, setEmployeeId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [surName, setSurName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [nic, setNic] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [personalEmail, setPersonalEmail] = useState('');
  const [personalPhoneNo, setPersonalPhoneNo] = useState('');
  const [officePhoneNo, setOfficePhoneNo] = useState('');
  const [dateJoin, setDateJoin] = useState('');

  const [baseSalary, setBaseSalary] = useState('');
  const [epf, setEpf] = useState('');
  const [etf, setEtf] = useState('');
  const [payeeTax, setPayeeTax] = useState('');

 // const [leaveCount, setLeaveCount] = useState('');

 const [leaveInputs, setLeaveInputs] = useState([
  { selectedLeaveType: "", leaveCount: 0 }
]);

const [allowanceInputs, setAllowanceInputs] = useState([
  { selectedAllowanceType: "", allowanceAmount: "" }
]);

  // const employeeId = useSelector(selectEmployeeId);
  const userId = useSelector(selectUserId);

  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEmployeeRecords());
      dispatch(fetchAllCountryNames());
      dispatch(fetchAllDepartments());
      dispatch(fetchAllUnitNames());
      dispatch(fetchAllContractTypes());
      dispatch(fetchAllRoles());
      dispatch(fetchAllEmployees());
      dispatch(fetchAllLeaveTypes());
      dispatch(fetchAllAllowanceTypes());
      
    }
  }, [dispatch, status]);

  useEffect(() => {
    
    if (selectedRecord) {
      
      setSelectedUnitName(selectedRecord.unit);
      setSelectedCountryName(selectedRecord.country);
      setSelectedDepartment(selectedRecord.department);
      setEmployeeId(selectedRecord.employeeId);
      setSelectedContractType(selectedRecord.contractType);
      setSelectedRole(selectedRecord.role);
      setFirstName(selectedRecord.firstName);
      setLastName(selectedRecord.lastName);
      setSurName(selectedRecord.surName);
      setEmail(selectedRecord.email);
      setPassword(selectedRecord.password);
      setBirthDate(selectedRecord.birthDate);
      setNic(selectedRecord.nic);
      setAddressLine1(selectedRecord.addressLine1);
      setAddressLine2(selectedRecord.addressLine2);
      setCity(selectedRecord.city);
      setState(selectedRecord.state);
      setPersonalEmail(selectedRecord.personalEmail);
      setPersonalPhoneNo(selectedRecord.personalPhoneNo);
      setOfficePhoneNo(selectedRecord.officePhoneNo);
      setDateJoin(selectedRecord.dateJoin);
      setSelectedEmployee(selectedRecord.reportPerson);
      setBaseSalary(selectedRecord.baseSalary);
      setEpf(selectedRecord.epf);
      setEtf(selectedRecord.etf);
      setPayeeTax(selectedRecord.payeeTax);

    }
  }, [selectedRecord]);

  // dark mode
  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);


  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  const validateForm = () => {
    const newErrors = {};

    if (!selectedCountryName) newErrors.selectedCountryName = 'Country name is required';
    if (!selectedUnitName) newErrors.selectedUnitName = 'Unit name is required';
    if (!selectedEmployee) newErrors.selectedEmployee = 'Report person name is required';
    if (!selectedDepartment) newErrors.selectedDepartment = 'Department name is required';
    if (!selectedContractType) newErrors.selectedContractType = 'Contract Type is required';
    if (!selectedRole) newErrors.selectedRole = 'Role name is required';
    if (!firstName) newErrors.firstName = 'First Name is required';
    if (!lastName) newErrors.lastName = 'Last Name is required';
    if (!surName) newErrors.surName = 'SurName is required';
    if (!employeeId) newErrors.employeeId = 'Employee ID is required';

    if (email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
        newErrors.email = 'Email must be a valid email address';
    } 

    if (!password) newErrors.password = 'Password is required';
    if (!birthDate) newErrors.birthDate = 'Birth Date is required';
    if (!nic) newErrors.nic = 'NIC is required';
    if (!addressLine1) newErrors.addressLine1 = 'Address is required';
    if (!city) newErrors.city = 'City is required';
    if (!state) newErrors.state = 'State is required';
    if (!personalEmail) newErrors.personalEmail = 'Personal Email is required';
    
    if (!personalPhoneNo) {
        newErrors.personalPhoneNo = 'Personal Phone Number is required';
    } else if (!/^\d+$/.test(personalPhoneNo)) {
        newErrors.personalPhoneNo = 'Personal Phone Number must contain only numbers';
    }
    
    if (officePhoneNo && !/^\d+$/.test(officePhoneNo)) {
        newErrors.officePhoneNo = 'Office Phone Number must contain only numbers';
    }
    
    if (!dateJoin) newErrors.dateJoin = 'Join Date is required';

    console.log("Validation Errors:", newErrors);  // Add this line
   
    // if (!baseSalary) {
    //   newErrors.baseSalary = 'Base Salary is required';
    // } else if (!/^\d+(\.\d{1,2})?$/.test(baseSalary)) {
    //   newErrors.baseSalary = 'Base Salary must be a valid number with up to two decimal places';
    // }

    // if (!epf && !/^\d+(\.\d{1,2})?$/.test(epf)) {
    //   newErrors.epf = 'EPF must be a valid number with up to two decimal places';
    // }

    // if (!/^\d+(\.\d{1,2})?$/.test(etf)) {
    //   newErrors.etf = 'ETF must be a valid number with up to two decimal places';
    // }

    // if (!/^\d+(\.\d{1,2})?$/.test(payeeTax)) {
    //   newErrors.payeeTax = 'Payee Tax must be a valid number with up to two decimal places';
    // }

    // for (const allowanceInput of allowanceInputs) {
    //   // Perform validation
    //   if (!allowanceInput.selectedAllowanceType){
    //     newErrors.selectedAllowanceType = 'Allowance type is required';
    //   }
  
    //   if (!allowanceInput.allowanceAmount){
    //     newErrors.allowanceAmount = 'Allowance amount is required';
    //   } else if (!/^\d+(\.\d{1,2})?$/.test(allowanceInput.allowanceAmount)) {
    //     newErrors.allowanceAmount = 'Allowance amount must be a valid number with up to two decimal places';
    //   }
    // }

    return newErrors;
};

  const handleUnitNameChange = (event) => {
    const selectedUN = event.target.value;
    setSelectedUnitName(selectedUN);
  };

  const handleReportPersonChange = (event) => {
    const selectedRP = event.target.value;
    setSelectedEmployee(selectedRP);
  };

  const handleCountryNameChange = (event) => {
    const selectedCN = event.target.value;
    setSelectedCountryName(selectedCN);
  };

  const handleDepartmentChange = (event) => {
    const selectedDept = event.target.value;
    setSelectedDepartment(selectedDept);
  };

 // Handle changes for leave type selection
const handleLeaveTypeChange = (e, index) => {
  const newLeaveInputs = [...leaveInputs];
  newLeaveInputs[index].selectedLeaveType = e.target.value;
  setLeaveInputs(newLeaveInputs);
};

const handleAllowanceTypeChange = (e, index) => {
  const newAllowanceInputs = [...allowanceInputs];
  newAllowanceInputs[index].selectedAllowanceType = e.target.value;
  setLeaveInputs(newAllowanceInputs);
};
// Handle changes for leave count input
const handleLeaveCountChange = (e, index) => {
  const newLeaveInputs = [...leaveInputs];
  let value = Math.floor(e.target.value);
  if (value <= 0) value = 0;
  newLeaveInputs[index].leaveCount = value;
  setLeaveInputs(newLeaveInputs);
};

const handleAllowanceAmountChange = (e, index) => {
  const newAllowanceInputs = [...allowanceInputs];
 // let value = Math.floor(e.target.value);
 // if (value <= 0) value = 0;
  newAllowanceInputs[index].allowanceAmount = e.target.value;
  setAllowanceInputs(newAllowanceInputs);
};

// Handle adding more leave input sets
const handleAddMoreLeaves = () => {
  setLeaveInputs([...leaveInputs, { selectedLeaveType: "", leaveCount: 0 }]);
};

const handleAddMoreAllowances = () => {
  setAllowanceInputs([...allowanceInputs, { selectedAllowanceType: "", allowanceAmount: "" }]);
};


  const handleContractTypeChange = (event) => {
    const selectedCT = event.target.value;
    setSelectedContractType(selectedCT);
  };

  const handleRoleChange = (event) => {
    const selectedRl = event.target.value;
    setSelectedRole(selectedRl);
  };

  const handleSubmitNewRecord = async (e) => {
    e.preventDefault();

    console.log("Submitting new record...");

    // Perform validation
    const newErrors = validateForm();
    console.log("Validation Errors:", newErrors);

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        alert("Please fix form errors before submitting.");
        return;
    } else {
        setErrors({});
    }

    const newEmployeeRecord = {
        countryName: selectedCountryName, 
        unitName: selectedUnitName, 
        department: selectedDepartment,
        employeeId: employeeId,
        contractType: selectedContractType,
        role: selectedRole, 
        firstName: firstName,
        lastName: lastName,
        surName: surName,
        email: email === "" ? null : email,  // Check if email is empty and pass null
        password: password,
        birthDate: birthDate,
        nic: nic,
        addressLine1: addressLine1,
        addressLine2: addressLine2 === "" ? null : addressLine2,
        city: city,
        state: state,
        personalEmail: personalEmail,
        personalPhoneNo: personalPhoneNo,
        officePhoneNo: officePhoneNo === "" ? null : officePhoneNo,
        dateJoin: dateJoin,
        reportPerson: selectedEmployee,
        insertBy: userId,
    };

    console.log("Dispatching insertNewEmployee with:", newEmployeeRecord);

    try {
        const result = await dispatch(insertNewEmployee(newEmployeeRecord)).unwrap();
        console.log("Employee insertion successful:", result);
        alert('Employee Record Inserted');

        // Reset form fields after successful submission
        setSelectedCountryName('');
        setSelectedUnitName('');
        setSelectedDepartment('');
        setSelectedContractType('');
        setSelectedRole('');
        setFirstName('');
        setLastName('');
        setSurName('');
        setEmployeeId('');
        setEmail('');
        setPassword('');
        setBirthDate('');
        setNic('');
        setAddressLine1('');
        setAddressLine2('');
        setCity('');
        setState('');
        setPersonalEmail('');
        setPersonalPhoneNo('');
        setOfficePhoneNo('');
        setDateJoin('');
        setSelectedEmployee('');

        dispatch(setIsNewRecordOpen(false)); // Close modal after success

    } catch (error) {
        console.error("Employee insertion error:", error);
        alert("Failed to insert employee record. Please try again.");
    }
};


  const handleUpdateRecord = async (e) => {
    e.preventDefault();

    // Log selectedRecord to debug
    // console.log("SELECTED RECORD: ", selectedRecord);
    console.log("SELECTED RECORD ID: ", selectedRecord?.Id);
    console.log("Unit Name: ", selectedRecord?.unitName);
    console.log("Dept Name: ", selectedRecord?.department);
    console.log("Country Name: ", selectedRecord?.countryName);

    // Perform validation
    const newErrors = validateForm();
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Stop submission if there are errors
    } else {
      setErrors({});
    }

    // Destructure selectedRecord for clarity
    const { Id } = selectedRecord;

    const updatedEmployee = {
      countryName: selectedCountryName,
      unitName: selectedUnitName,
      department: selectedDepartment, 
      employeeId: employeeId,
      contractType: selectedContractType, 
      role: selectedRole, 
      firstName: firstName,
      lastName: lastName, 
      surName: surName, 
      email: email === "" ? null : email, 
      //password: password, 
      birthDate: birthDate, 
      nic: nic, 
      addressLine1: addressLine1, 
      addressLine2: addressLine2 === "" ? null : addressLine2, 
      city: city, 
      state: state, 
      personalEmail: personalEmail, 
      personalPhoneNo: personalPhoneNo, 
      officePhoneNo: officePhoneNo === "" ? null : officePhoneNo, 
      dateJoin: dateJoin, 
      reportPerson: selectedEmployee,
      updateBy: userId, 
      Id: Id
    };

    console.log("Updated Employee Object: ", updatedEmployee);

    try {
      const result = await dispatch(updateEmployee(updatedEmployee)).unwrap();
      console.log("Employee update successful:", result);
      alert('Employee Record Updated');
  
    } catch (error) {
      console.error("Employee update error:", error);
      // Handle error, optionally display a message to the user
    }
};   

// Handle saving the leave inputs
const handleSetLeaves = async (e) => {
  e.preventDefault();

  // Perform validation
  const newErrors = validateForm();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return; // Stop submission if there are errors
  } else {
    setErrors({});
  }

  try {
    // Iterate through the leaveInputs array and dispatch each leave record
    for (const leaveInput of leaveInputs) {
      const employeewiseLeaveData = {
        employeeId: employeeId,                // Assuming employeeId is already defined
        leaveType: leaveInput.selectedLeaveType,
        dateCount: leaveInput.leaveCount,
        insertBy: userId,                      // Assuming userId is already defined
      };

      // Dispatch the action for each leave record
      const result = await dispatch(setEmployeewiseLeave(employeewiseLeaveData)).unwrap();
      console.log("Leave insertion successful for:", leaveInput.selectedLeaveType, result);
    }

    alert('Leave records have been set successfully');

    // Reset form fields after successful submission
    setLeaveInputs([{ selectedLeaveType: "", leaveCount: 0 }]);

  } catch (error) {
    console.error("Leave insertion error:", error);
    // Optionally display a message to the user about the error
  }
};

// Handle saving the allowance inputs
const handleSetAllowances = async (e) => {
  e.preventDefault();

  // Perform validation
  const newErrors = validateForm();
  
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return; // Stop submission if there are errors
  } else {
    setErrors({});
  }
  try {
    // Iterate through the allowanceInput array and dispatch each allowance record
    for (const allowanceInput of allowanceInputs) {
      const allowanceData = {
        employeeId: employeeId,                // Assuming employeeId is already defined
        allowanceType: allowanceInput.selectedAllowanceType,
        allowanceAmount: allowanceInput.allowanceAmount,
        createBy: userId,                      // Assuming userId is already defined
      };

      // Dispatch the action for each leave record
      const result = await dispatch(setAllowanceDetails(allowanceData)).unwrap();
      console.log("Allowance insertion successful for:", allowanceInput.selectedAllowanceType, result);
    }

    alert('Allowance records have been set successfully');

    // Reset form fields after successful submission
    setAllowanceInputs([{ selectedAllowanceType: "", allowanceAmount: "" }]);

  } catch (error) {
    console.error("Allowance insertion error:", error);
    // Optionally display a message to the user about the error
  }
};

const handleSetSalary = async (e) => {
  e.preventDefault();

  // Perform validation
  const newErrors = validateForm();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return; // Stop submission if there are errors
  } else {
    setErrors({});
  }

  try {
    
      const salaryData = {
        employeeId: employeeId,            
        baseSalary: baseSalary,
        epf: epf,
        etf: etf,    
        payeeTax: payeeTax,
        createBy: userId,                 
      };

      // Dispatch the action for each leave record
      const result = await dispatch(setSalaryDetails(salaryData)).unwrap();
      console.log("Leave insertion successful", result);
    

    alert('Salary has been set successfully');

  } catch (error) {
    console.error("Salary insertion error:", error);
  }
};


  // Handler to open the update modal
const handleOpenUpdateModal = () => {
  // dispatch(setUpdateData(selectedRecord));
  dispatch(setIsUpdateModalOpen(true));
};

// Handler to close the update modal
const handleCloseUpdateModal = () => {
  dispatch(setIsUpdateModalOpen(false));
};

const handleOpenSetLeavesModal = () => {
  dispatch(setLeavesModalOpen(true));
};

const handleCloseSetLeavesModal = () => {
  dispatch(setLeavesModalOpen(false));
};

const handleOpenSetSalaryModal = () => {
  dispatch(setSalaryModalOpen(true));
};

const handleCloseSetSalaryModal = () => {
  dispatch(setSalaryModalOpen(false));
};

const handleOpenSetAllowanceModal = () => {
  dispatch(setAllowanceModalOpen(true));
};

const handleCloseSetAllowanceModal = () => {
  dispatch(setAllowanceModalOpen(false));
};
 
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    
    dispatch(setFilters({ [name]: value }));
  };

  const handleSearchByChange = (event) => {
    dispatch(setFilters({ searchBy: event.target.value }));
  };

  const handleRowClick = (detail) => {
    dispatch(setSelectedRecord(detail));
    dispatch(setIsModalOpen(true));
  };

  const handleCloseModal = () => {
    dispatch(setIsModalOpen(false));
    dispatch(setSelectedRecord(null));
  };

  const handleNewRecordClick = () => {
    // dispatch(setSelectedRecord(detail));
    setSelectedCountryName('');
      setSelectedUnitName('');
      setSelectedDepartment('');
      setSelectedContractType('');
      setSelectedRole('');
      setFirstName('');
      setLastName('');
      setSurName('');
      setEmployeeId('');
      setEmail('');
      setPassword('');
      setBirthDate('');
      setNic('');
      setAddressLine1('');
      setAddressLine2('');
      setCity('');
      setState('');
      setPersonalEmail('');
      setPersonalPhoneNo('');
      setOfficePhoneNo('');
      setDateJoin('');
      setSelectedEmployee('');

    dispatch(setIsNewRecordOpen(true));
  };

  const handleCloseNewRecord = () => {
    dispatch(setIsNewRecordOpen(false));
    // dispatch(setSelectedRecord(null));
  };

  const formatInsertDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  const filteredEmployeeRecords = employeeRecords
  .filter((detail) => {
    if (filters.status !== 'inactive') {
      return true;
    }
    return detail.status === filters.status;
  })
  .filter((detail) => {
    const searchTerm = filters[filters.searchBy]?.toLowerCase() || '';
    const valueToSearch = detail[filters.searchBy] != null ? detail[filters.searchBy].toString().toLowerCase() : '';
    return valueToSearch.includes(searchTerm);
  })
  .filter((detail) => {
    if (filters.month && filters.year) {
      const date = new Date(detail.insertDate);
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear().toString();
      return month === filters.month && year === filters.year;
    }
    return true;
  });


  const totalItems = filteredEmployeeRecords.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployeeRecords.slice(indexOfFirstItem, indexOfLastItem);


  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => dispatch(setCurrentPage(pageNumber));

  return (
    <div className="bg-gray-50 dark:bg-gray-900 dark:text-gray-200 min-h-screen ">
    <div className="overflow-x-auto rounded-lg shadow-md bg-white p-4 ml-64 dark:bg-gray-800 dark:text-gray-200">
        <br />
        <div className="flex items-center justify-between space-x-4 mb-4">
    <div className="flex space-x-4">
        <select
            name="searchBy"
            value={filters.searchBy}
            onChange={handleSearchByChange}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-200"
        >
            <option value="Id">Id</option>
            <option value="employeeId">Employee Id</option>
            <option value="firstName">First Name</option>
            <option value="lastName">Last Name</option>
            <option value="department">Department</option>
            <option value="contractType">Contract Type</option>
            <option value="unit">Unit Name</option>
            <option value="role">Role</option>

        </select>
        <input
            type="text"
            placeholder={`Search by ${filters.searchBy}`}
            name={filters.searchBy}
            value={filters[filters.searchBy]}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-200"
        />
        <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-200"
        >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
        </select>
    </div>

    <button
        className="rounded-full bg-red-600 p-2 text-white flex items-center space-x-2 dark:bg-red-500"
        onClick={handleNewRecordClick}
    >
        <span className="ml-2">Add Employee</span>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
        </svg>
    </button>
</div>



      <table className="min-w-full bg-white border border-gray-200 divide-y divide-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Id</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Employee Id</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Department</th>
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th> */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Country</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">NIC</th>

          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
          
          {currentItems.map((detail) => (
            <tr key={detail.id} onClick={() => handleRowClick(detail)} className="cursor-pointer">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{detail.Id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{detail.employeeId}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{detail.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{detail.role}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{detail.department}</td>
              {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{detail.unit}</td> */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{detail.country}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{detail.email == null ? 'NA' : detail.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{detail.nic}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between">
        <div>
          <label htmlFor="itemsPerPage" className="text-sm">Items per page:</label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => dispatch(setItemsPerPage(Number(e.target.value)))}
            className="ml-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-200"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div>
        <ul className="flex space-x-2">
          {pageNumbers.map(number => (
            <li key={number} className="page-item">
              <button
                onClick={() => paginate(number)}
                className={`px-3 py-1 rounded-md ${currentPage === number ? 'bg-gray-300' : 'bg-white'} border border-gray-300`}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      </div>
      
  {isModalOpen && selectedRecord && (
        // Below onclick will handle clicks outside the modal
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center" onClick={handleCloseModal} >
    {/* Below onclick will prevent the modal from closing if the click is inside the modal content */}
    <div className="bg-white p-6 rounded-lg shadow-lg w-60/100" onClick={(e) => e.stopPropagation()}>
      <h2 className="text-lg font-medium mb-4">Employee Details</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <tbody>
          {/* <tr>
            <td className="px-6 py-2 text-sm font-medium text-gray-900">ID:</td>
            <td className="px-6 py-2 text-sm text-gray-500">{selectedRecord.Id}</td>
          </tr> */}
          <tr>
            <td className="px-6 py-2 text-sm font-medium text-gray-900">Employee ID:</td>
            <td className="px-6 py-2 text-sm text-gray-500">{selectedRecord.employeeId}</td>
          </tr>
          <tr>
            <td className="px-6 py-2 text-sm font-medium text-gray-900">First Name:</td>
            <td className="px-6 py-2 text-sm text-gray-500">{selectedRecord.firstName}</td>
          </tr>
          <tr>
            <td className="px-6 py-2 text-sm font-medium text-gray-900">Last Name:</td>
            <td className="px-6 py-2 text-sm text-gray-500">{selectedRecord.lastName}</td>
          </tr>
          <tr>
            <td className="px-6 py-2 text-sm font-medium text-gray-900">SurName:</td>
            <td className="px-6 py-2 text-sm text-gray-500">{selectedRecord.surName}</td>
          </tr>
          <tr>
            <td className="px-6 py-2 text-sm font-medium text-gray-900">Role:</td>
            <td className="px-6 py-2 text-sm text-gray-500">{selectedRecord.role}</td>
          </tr>
          <tr>
            <td className="px-6 py-2 text-sm font-medium text-gray-900">Department:</td>
            <td className="px-6 py-2 text-sm text-gray-500">{selectedRecord.department}</td>
          </tr>
          <tr>
            <td className="px-6 py-2 text-sm font-medium text-gray-900">Unit:</td>
            <td className="px-6 py-2 text-sm text-gray-500">{selectedRecord.unit}</td>
          </tr>
          <tr>
            <td className="px-6 py-2 text-sm font-medium text-gray-900">Contract Type:</td>
            <td className="px-6 py-2 text-sm text-gray-500">{selectedRecord.contractType}</td>
          </tr>
          <tr>
            <td className="px-6 py-2 text-sm font-medium text-gray-900">Report Person:</td>
            <td className="px-6 py-2 text-sm text-gray-500">{selectedRecord.reportPerson}</td>
          </tr>
          <tr>
            <td className="px-6 py-2 text-sm font-medium text-gray-900">Email:</td>
            <td className="px-6 py-2 text-sm text-gray-500">{selectedRecord.email == null ? 'NA' : selectedRecord.email}</td>
          </tr>
          <tr>
            <td className="px-6 py-2 text-sm font-medium text-gray-900">Personal Phone:</td>
            <td className="px-6 py-2 text-sm text-gray-500">{selectedRecord.personalPhoneNo}</td>
          </tr>
          <tr>
            <td className="px-6 py-2 text-sm font-medium text-gray-900">Office Phone:</td>
            <td className="px-6 py-2 text-sm text-gray-500">{selectedRecord.officePhoneNo == null ? 'NA' : selectedRecord.officePhoneNo}</td>
          </tr>
          <tr>
            <td className="px-6 py-2 text-sm font-medium text-gray-900">Address:</td>
            <td className="px-6 py-2 text-sm text-gray-500">{selectedRecord.address}</td>
          </tr>
          <tr>
            <td className="px-6 py-2 text-sm font-medium text-gray-900">Personal Email:</td>
            <td className="px-6 py-2 text-sm text-gray-500">{selectedRecord.personalEmail}</td>
          </tr>
          <tr>
            <td className="px-6 py-2 text-sm font-medium text-gray-900">Birth Date:</td>
            <td className="px-6 py-2 text-sm text-gray-500">{formatInsertDate(selectedRecord.birthDate)}</td>
          </tr>
          <tr>
            <td className="px-6 py-2 text-sm font-medium text-gray-900">NIC:</td>
            <td className="px-6 py-2 text-sm text-gray-500">{selectedRecord.nic}</td>
          </tr>
          <tr>
            <td className="px-6 py-1 text-sm font-medium text-gray-900">Joined Date:</td>
            <td className="px-6 py-1 text-sm text-gray-500">{formatInsertDate(selectedRecord.dateJoin)}</td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-end mt-4">
      <button
         onClick={handleOpenSetSalaryModal}
          className="px-4 py-2 bg-red-600 text-white rounded-md mr-2"
        >
          Set Salary
        </button>
        <button
         onClick={handleOpenSetAllowanceModal}
          className="px-4 py-2 bg-red-600 text-white rounded-md mr-2"
        >
          Set Allowances
        </button>
      <button
          onClick={handleOpenSetLeavesModal}
          className="px-4 py-2 bg-red-600 text-white rounded-md mr-2"
        >
          Set Leaves
        </button>
        <button
          onClick={handleOpenUpdateModal}
          className="px-4 py-2 bg-red-600 text-white rounded-md mr-2"
        >
          Update
        </button>
        <button
          onClick={handleCloseModal}
          className="px-4 py-2 bg-red-600 text-white rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

{isUpdateModalOpen && selectedRecord && (
  <div
    className="fixed inset-0 bg-gray-700 bg-opacity-70 flex justify-center items-center"
    onClick={handleCloseUpdateModal} // Handle click outside the modal to close it
  >
    <div
      className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl h-[80vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()} // Prevent modal from closing if click inside modal content
    >
      <h2 className="text-lg font-medium mb-4">Update Employee Details</h2>
      {/* <form onSubmit={handleUpdateSubmit}> */}
      <form >

        {/* Input fields pre-populated with selectedRecord's values */}

      {/* First Name Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.firstName ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="firstName"
        >
          First Name
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.firstName ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter First Name"
          defaultValue={selectedRecord.firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        {errors.firstName && (
          <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
        )}
      </div>

      {/* Last Name Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.lastName ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="lastName"
        >
          Last Name
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.lastName ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter Last Name"
          defaultValue={selectedRecord.lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        {errors.lastName && (
          <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
        )}
      </div>

      {/* surName Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.surName ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="surName"
        >
          SurName
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.surName ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter SurName"
          defaultValue={selectedRecord.surName}
          onChange={(e) => setSurName(e.target.value)}
        />
        {errors.surName && (
          <p className="text-red-600 text-sm mt-1">{errors.surName}</p>
        )}
      </div>

      {/* employeeId Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.employeeId ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="employeeId"
        >
          Employee ID
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.employeeId ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter Employee ID"
          defaultValue={selectedRecord.employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        />
        {errors.employeeId && (
          <p className="text-red-600 text-sm mt-1">{errors.employeeId}</p>
        )}
      </div>

      {/* Nic Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.nic ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="nic"
        >
          NIC
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.nic ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter NIC"
          defaultValue={selectedRecord.nic}
          onChange={(e) => setNic(e.target.value)}
        />
        {errors.nic && (
          <p className="text-red-600 text-sm mt-1">{errors.nic}</p>
        )}
      </div>

      {/* Birth Date Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.birthDate ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="birthDate"
        >
          Birth Date
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.birthDate ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="date"
          placeholder="Enter Birth Date"
          defaultValue={selectedRecord.birthDate ? new Date(new Date(selectedRecord.birthDate).setDate(new Date(selectedRecord.birthDate).getDate() + 1)).toISOString().split('T')[0] : ''}
          onChange={(e) => setBirthDate(e.target.value)}
        />
        {errors.birthDate && (
          <p className="text-red-600 text-sm mt-1">{errors.birthDate}</p>
        )}
      </div>

      {/* Address Line 1 Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.addressLine1 ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="addressLine1"
        >
          Address Line 1
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.addressLine1 ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter addressLine1"
          defaultValue={selectedRecord.addressLine1}
          onChange={(e) => setAddressLine1(e.target.value)}
        />
        {errors.addressLine1 && (
          <p className="text-red-600 text-sm mt-1">{errors.addressLine1}</p>
        )}
      </div>

      {/* Address Line 2 Input */}
      <div className="mb-5">
        <label
          className={"block text-gray-700 text-sm font-medium mb-2"}
          htmlFor="addressLine2"
        >
          Address Line 2
        </label>
        <input
          className={"w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-gray-600 focus:border-red-600"}
          type="text"
          placeholder="Enter addressLine2"
          defaultValue={selectedRecord.addressLine2}
          onChange={(e) => setAddressLine2(e.target.value === "" ? null : e.target.value)}
        />
        {/* {errors.addressLine2 && (
          <p className="text-red-600 text-sm mt-1">{errors.addressLine2}</p>
        )} */}
      </div>

      {/* City Name Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.city ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="city"
        >
          City
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.city ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter City"
          defaultValue={selectedRecord.city}
          onChange={(e) => setCity(e.target.value)}
        />
        {errors.city && (
          <p className="text-red-600 text-sm mt-1">{errors.city}</p>
        )}
      </div>

      {/* State Name Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.state ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="state"
        >
          State
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.state ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter State"
          defaultValue={selectedRecord.state}
          onChange={(e) => setState(e.target.value)}
        />
        {errors.state && (
          <p className="text-red-600 text-sm mt-1">{errors.state}</p>
        )}
      </div>

      {/* Country selection*/}
      <div className="mb-5">
          <label
            className={`block text-sm font-medium mb-2 ${errors.selectedCountryName ? 'text-red-600' : 'text-gray-700'}`}
            htmlFor="countryNameSelect"
          >
            Select Country Name
          </label>
          <select
            value={selectedCountryName || selectedRecord.countryName}
            onChange={handleCountryNameChange}
            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
              errors.selectedCountryName ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
            }`}
          >
            <option value="" disabled>Select Country Name</option>
            {countryNames.map((countryName) => (
              <option key={countryName.countryName} value={countryName.countryName}>
                {countryName.countryName}
              </option>
            ))}
          </select>
          {errors.selectedCountryName && (
            <p className="text-red-600 text-sm mt-1">{errors.selectedCountryName}</p>
          )}
        </div>

      {/*Personal Email Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.personalEmail ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="personalEmail"
        >
          Personal Email
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.personalEmail ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter Personal Email"
          defaultValue={selectedRecord.personalEmail}
          onChange={(e) => setPersonalEmail(e.target.value)}
        />
        {errors.personalEmail && (
          <p className="text-red-600 text-sm mt-1">{errors.personalEmail}</p>
        )}
      </div>

      {/* Personal Phone No Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.personalPhoneNo ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="personalPhoneNo"
        >
          Personal Phone Number
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.personalPhoneNo ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter Personal Phone Number"
          defaultValue={selectedRecord.personalPhoneNo}
          onChange={(e) => setPersonalPhoneNo(e.target.value)}
        />
        {errors.personalPhoneNo && (
          <p className="text-red-600 text-sm mt-1">{errors.personalPhoneNo}</p>
        )}
      </div>

      {/* Unit Name Dropdown */}
      <div className="mb-5">
          <label
            className={`block text-sm font-medium mb-2 ${errors.selectedUnitName ? 'text-red-600' : 'text-gray-700'}`}
            htmlFor="unitSelect"
          >
            Select Unit Name
          </label>
          <select
            value={selectedUnitName || selectedRecord.unitName}
            onChange={handleUnitNameChange}
            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
              errors.selectedUnitName ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
            }`}
          >
            <option value="" disabled>Select Unit Name</option>
            {unitNames.map((unitName) => (
              <option key={unitName.unitName} value={unitName.unitName}>
                {unitName.unitName}
              </option>
            ))}
          </select>
          {errors.selectedUnitName && (
            <p className="text-red-600 text-sm mt-1">{errors.selectedUnitName}</p>
          )}
        </div>

        {/* Department Name Dropdown */}
      <div className="mb-5">
          <label
            className={`block text-sm font-medium mb-2 ${errors.selectedDepartment ? 'text-red-600' : 'text-gray-700'}`}
            htmlFor="departmentSelect"
          >
            Select Department
          </label>
          <select
            value={selectedDepartment || selectedRecord.department}
            onChange={handleDepartmentChange}
            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
              errors.selectedDepartment ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
            }`}
          >
            <option value="" disabled>Select Department</option>
            {departments.map((department) => (
              <option key={department.department} value={department.department}>
                {department.department}
              </option>
            ))}
          </select>
          {errors.selectedDepartment && (
            <p className="text-red-600 text-sm mt-1">{errors.selectedDepartment}</p>
          )}
        </div>

        {/* Role Name Dropdown */}
      <div className="mb-5">
          <label
            className={`block text-sm font-medium mb-2 ${errors.selectedRole ? 'text-red-600' : 'text-gray-700'}`}
            htmlFor="roleSelect"
          >
            Select Role
          </label>
          <select
            value={selectedRole || selectedRecord.role}
            onChange={handleRoleChange}
            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
              errors.selectedRole ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
            }`}
          >
            <option value="" disabled>Select Role</option>
            {roles.map((role) => (
              <option key={role.role} value={role.role}>
                {role.role}
              </option>
            ))}
          </select>
          {errors.selectedRole && (
            <p className="text-red-600 text-sm mt-1">{errors.selectedRole}</p>
          )}
        </div>

        {/* Contract Type Dropdown */}
      <div className="mb-5">
          <label
            className={`block text-sm font-medium mb-2 ${errors.selectedContractType ? 'text-red-600' : 'text-gray-700'}`}
            htmlFor="contractTypeSelect"
          >
            Select Contract Type
          </label>
          <select
            value={selectedContractType || selectedRecord.contractType}
            onChange={handleContractTypeChange}
            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
              errors.selectedContractType ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
            }`}
          >
            <option value="" disabled>Select Contract Type</option>
            {contractTypes.map((contractType) => (
              <option key={contractType.contractType} value={contractType.contractType}>
                {contractType.contractType}
              </option>
            ))}
          </select>
          {errors.selectedContractType && (
            <p className="text-red-600 text-sm mt-1">{errors.selectedContractType}</p>
          )}
        </div>

        {/* Employee Selection Dropdown */}
    <div className="mb-5">
      <label className={`block text-sm font-medium mb-2 ${errors.selectedEmployee ? 'text-red-600' : 'text-gray-700'}`}
      htmlFor="employeeSelect">
        Report Person
      </label>

      <select
        value={selectedEmployee || selectedRecord.reportPerson}
        // onChange={handleEmployeeChange}
        onChange={handleReportPersonChange}

        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
          errors.selectedEmployee ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
        }`}
      >
        <option value="" disabled>Select Report Person</option>
        {employees.map((employee) => (
          <option key={employee.name} value={employee.name}>
            {employee.name}
          </option>
        ))}
      </select>
      {errors.selectedEmployee && (
          <p className="text-red-600 text-sm mt-1">{errors.selectedEmployee}</p>
        )}
    </div>

        {/* Join Date Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.dateJoin ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="dateJoin"
        >
          Join Date
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.dateJoin ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-red-600'
          }`}
          type="date"
          placeholder="Enter Join Date"
          defaultValue={selectedRecord.dateJoin ? new Date(new Date(selectedRecord.dateJoin).setDate(new Date(selectedRecord.dateJoin).getDate() + 1)).toISOString().split('T')[0] : ''}
          onChange={(e) => setDateJoin(e.target.value)}
        />
        {errors.dateJoin && (
          <p className="text-red-600 text-sm mt-1">{errors.dateJoin}</p>
        )}
      </div>

        {/*Company Email Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.email ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="email"
        >
          Company Email
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.email ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter Company Email"
          defaultValue={selectedRecord.email}
          onChange={(e) => setEmail(e.target.value === "" ? null : e.target.value)}
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Password Input
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.password ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="password"
        >
          Password
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.password ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-red-600'
          }`}
          type="password"
          placeholder="Enter Password"
          defaultValue={selectedRecord.password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && (
          <p className="text-red-600 text-sm mt-1">{errors.password}</p>
        )}
      </div> */}

      {/* Office Phone No Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.officePhoneNo ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="officePhoneNo"
        >
          Office Phone Number
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.officePhoneNo ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter Office Phone Number"
          defaultValue={selectedRecord.officePhoneNo}
          onChange={(e) => setOfficePhoneNo(e.target.value === "" ? null : e.target.value)}
        />
        {errors.officePhoneNo && (
          <p className="text-red-600 text-sm mt-1">{errors.officePhoneNo}</p>
        )}
      </div>

     


     

        {/* Additional input fields */}
        <div className="flex justify-end mt-4">
        <button
          onClick={handleUpdateRecord}
          className="px-5 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 focus:ring-2 focus:ring-red-600 mr-2"
        >
          Save
        </button>
          <button
            onClick={handleCloseUpdateModal}
            className="px-4 py-2 bg-gray-600 text-white rounded-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}



{isNewRecordOpen && (

  <div className="fixed inset-0 bg-gray-700 bg-opacity-70 flex justify-center items-center" onClick={handleCloseNewRecord}>
  <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
    <h2 className="text-xl font-semibold text-red-600 mb-6">Add Employee</h2>

        {/* First Name Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.firstName ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="firstName"
        >
          First Name
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.firstName ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        {errors.firstName && (
          <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
        )}
      </div>

      {/* Last Name Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.lastName ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="lastName"
        >
          Last Name
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.lastName ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        {errors.lastName && (
          <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
        )}
      </div>

      {/* surName Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.surName ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="surName"
        >
          SurName
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.surName ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter SurName"
          value={surName}
          onChange={(e) => setSurName(e.target.value)}
        />
        {errors.surName && (
          <p className="text-red-600 text-sm mt-1">{errors.surName}</p>
        )}
      </div>

      {/* employeeId Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.employeeId ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="employeeId"
        >
          Employee ID
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.employeeId ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        />
        {errors.employeeId && (
          <p className="text-red-600 text-sm mt-1">{errors.employeeId}</p>
        )}
      </div>

      {/* Nic Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.nic ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="nic"
        >
          NIC
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.nic ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter NIC"
          value={nic}
          onChange={(e) => setNic(e.target.value)}
        />
        {errors.nic && (
          <p className="text-red-600 text-sm mt-1">{errors.nic}</p>
        )}
      </div>

      {/* Birth Date Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.birthDate ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="birthDate"
        >
          Birth Date
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.birthDate ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="date"
          placeholder="Enter Birth Date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
        {errors.birthDate && (
          <p className="text-red-600 text-sm mt-1">{errors.birthDate}</p>
        )}
      </div>

      {/* Address Line 1 Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.addressLine1 ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="addressLine1"
        >
          Address Line 1
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.addressLine1 ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter addressLine1"
          value={addressLine1}
          onChange={(e) => setAddressLine1(e.target.value)}
        />
        {errors.addressLine1 && (
          <p className="text-red-600 text-sm mt-1">{errors.addressLine1}</p>
        )}
      </div>

      {/* Address Line 2 Input */}
      <div className="mb-5">
        <label
          className={"block text-gray-700 text-sm font-medium mb-2"}
          htmlFor="addressLine2"
        >
          Address Line 2
        </label>
        <input
          className={"w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-gray-600 focus:border-red-600"}
          type="text"
          placeholder="Enter addressLine2"
          value={addressLine2}
          onChange={(e) => setAddressLine2(e.target.value === "" ? null : e.target.value)}
          // onChange={(e) => setAddressLine2(e.target.value)}
        />
        {/* {errors.addressLine2 && (
          <p className="text-red-600 text-sm mt-1">{errors.addressLine2}</p>
        )} */}
      </div>

      {/* City Name Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.city ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="city"
        >
          City
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.city ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        {errors.city && (
          <p className="text-red-600 text-sm mt-1">{errors.city}</p>
        )}
      </div>

      {/* State Name Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.state ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="state"
        >
          State
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.state ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter State"
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
        {errors.state && (
          <p className="text-red-600 text-sm mt-1">{errors.state}</p>
        )}
      </div>

      {/* Country selection*/}
      <div className="mb-5">
          <label
            className={`block text-sm font-medium mb-2 ${errors.selectedCountryName ? 'text-red-600' : 'text-gray-700'}`}
            htmlFor="countrySelect"
          >
            Select Country Name
          </label>
          <select
            value={selectedCountryName}
            onChange={handleCountryNameChange}
            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
              errors.selectedCountryName ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
            }`}
          >
            <option value="" disabled>Select Country Name</option>
            {countryNames.map((countryName) => (
              <option key={countryName.countryName} value={countryName.countryName}>
                {countryName.countryName}
              </option>
            ))}
          </select>
          {errors.selectedCountryName && (
            <p className="text-red-600 text-sm mt-1">{errors.selectedCountryName}</p>
          )}
        </div>

      {/*Personal Email Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.personalEmail ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="personalEmail"
        >
          Personal Email
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.personalEmail ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter Personal Email"
          value={personalEmail}
          onChange={(e) => setPersonalEmail(e.target.value)}
        />
        {errors.personalEmail && (
          <p className="text-red-600 text-sm mt-1">{errors.personalEmail}</p>
        )}
      </div>

      {/* Personal Phone No Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.personalPhoneNo ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="personalPhoneNo"
        >
          Personal Phone Number
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.personalPhoneNo ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter Personal Phone Number"
          value={personalPhoneNo}
          onChange={(e) => setPersonalPhoneNo(e.target.value)}
        />
        {errors.personalPhoneNo && (
          <p className="text-red-600 text-sm mt-1">{errors.personalPhoneNo}</p>
        )}
      </div>

      {/* Unit Name Dropdown */}
      <div className="mb-5">
          <label
            className={`block text-sm font-medium mb-2 ${errors.selectedUnitName ? 'text-red-600' : 'text-gray-700'}`}
            htmlFor="unitSelect"
          >
            Select Unit Name
          </label>
          <select
            value={selectedUnitName}
            onChange={handleUnitNameChange}
            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
              errors.selectedUnitName ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
            }`}
          >
            <option value="" disabled>Select Unit Name</option>
            {unitNames.map((unitName) => (
              <option key={unitName.unitName} value={unitName.unitName}>
                {unitName.unitName}
              </option>
            ))}
          </select>
          {errors.selectedUnitName && (
            <p className="text-red-600 text-sm mt-1">{errors.selectedUnitName}</p>
          )}
        </div>

        {/* Department Name Dropdown */}
      <div className="mb-5">
          <label
            className={`block text-sm font-medium mb-2 ${errors.selectedDepartment ? 'text-red-600' : 'text-gray-700'}`}
            htmlFor="departmentSelect"
          >
            Select Department
          </label>
          <select
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
              errors.selectedDepartment ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
            }`}
          >
            <option value="" disabled>Select Department</option>
            {departments.map((department) => (
              <option key={department.department} value={department.department}>
                {department.department}
              </option>
            ))}
          </select>
          {errors.selectedDepartment && (
            <p className="text-red-600 text-sm mt-1">{errors.selectedDepartment}</p>
          )}
        </div>

        {/* Role Name Dropdown */}
      <div className="mb-5">
          <label
            className={`block text-sm font-medium mb-2 ${errors.selectedRole ? 'text-red-600' : 'text-gray-700'}`}
            htmlFor="roleSelect"
          >
            Select Role
          </label>
          <select
            value={selectedRole}
            onChange={handleRoleChange}
            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
              errors.selectedRole ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
            }`}
          >
            <option value="" disabled>Select Role</option>
            {roles.map((role) => (
              <option key={role.role} value={role.role}>
                {role.role}
              </option>
            ))}
          </select>
          {errors.selectedRole && (
            <p className="text-red-600 text-sm mt-1">{errors.selectedRole}</p>
          )}
        </div>

        {/* Contract Type Dropdown */}
      <div className="mb-5">
          <label
            className={`block text-sm font-medium mb-2 ${errors.selectedContractType ? 'text-red-600' : 'text-gray-700'}`}
            htmlFor="contractTypeSelect"
          >
            Select Contract Type
          </label>
          <select
            value={selectedContractType}
            onChange={handleContractTypeChange}
            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
              errors.selectedContractType ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
            }`}
          >
            <option value="" disabled>Select Contract Type</option>
            {contractTypes.map((contractType) => (
              <option key={contractType.contractType} value={contractType.contractType}>
                {contractType.contractType}
              </option>
            ))}
          </select>
          {errors.selectedContractType && (
            <p className="text-red-600 text-sm mt-1">{errors.selectedContractType}</p>
          )}
        </div>

        {/* Employee Selection Dropdown */}
    <div className="mb-5">
      <label className={`block text-sm font-medium mb-2 ${errors.selectedEmployee ? 'text-red-600' : 'text-gray-700'}`}
      htmlFor="employeeSelect">
        Report Person
      </label>

      <select
        value={selectedEmployee}
        // onChange={handleEmployeeChange}
        onChange={handleReportPersonChange}

        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
          errors.selectedEmployee ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
        }`}
      >
        <option value="" disabled>Select Report Person</option>
        {employees.map((employee) => (
          <option key={employee.name} value={employee.name}>
            {employee.name}
          </option>
        ))}
      </select>
      {errors.selectedEmployee && (
          <p className="text-red-600 text-sm mt-1">{errors.selectedEmployee}</p>
        )}
    </div>

        {/* Join Date Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.dateJoin ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="dateJoin"
        >
          Join Date
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.dateJoin ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="date"
          placeholder="Enter Join Date"
          value={dateJoin}
          onChange={(e) => setDateJoin(e.target.value)}
        />
        {errors.dateJoin && (
          <p className="text-red-600 text-sm mt-1">{errors.dateJoin}</p>
        )}
      </div>

        {/*Company Email Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.email ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="email"
        >
          Company Email
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.email ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter Company Email"
          value={email}
          onChange={(e) => setEmail(e.target.value === "" ? null : e.target.value)}
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Password Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.password ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="password"
        >
          Password
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.password ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && (
          <p className="text-red-600 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      {/* Office Phone No Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.officePhoneNo ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="officePhoneNo"
        >
          Office Phone Number
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.officePhoneNo ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter Office Phone Number"
          value={officePhoneNo}
          onChange={(e) => setOfficePhoneNo(e.target.value === "" ? null : e.target.value)}
        />
        {errors.officePhoneNo && (
          <p className="text-red-600 text-sm mt-1">{errors.officePhoneNo}</p>
        )}
      </div>


    <div className="flex justify-end space-x-3 mt-6">
      <button
        onClick={handleSubmitNewRecord}
        className="px-5 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 focus:ring-2 focus:ring-red-600"
      >
        Submit
      </button>
      <button
        onClick={handleCloseNewRecord}
        className="px-5 py-2 bg-gray-600 text-white rounded-md shadow hover:bg-gray-700 focus:ring-2 focus:ring-gray-600"
      >
        Close
      </button>
    </div>
  </div>
</div>
)}


{isSetLeavesModalOpen && (
  <div
    className="fixed inset-0 bg-gray-700 bg-opacity-70 flex justify-center items-center"
    onClick={handleCloseSetLeavesModal}
  >
    <div
      className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl h-[80vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center w-full mb-6">
        <h2 className="text-xl font-semibold text-red-600">Set Leaves</h2>

        <div className="mt-8">
          <button
            className="rounded-full bg-red-600 p-2 text-white flex items-center space-x-2"
            onClick={handleAddMoreLeaves}
          >
            Add More
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>
      </div>


      <div className="space-y-6">
  {/* Iterate over the leave input sets */}
  {leaveInputs.map((leaveInput, index) => (
    <div key={index} className="flex justify-start space-x-6 items-center">
      {/* Leave Type Dropdown */}
      <div className="mb-5">
        <label className="block text-sm font-medium mb-2 text-gray-700">
          Select Leave Type
        </label>
        <select
          value={leaveInput.selectedLeaveType}
          onChange={(e) => handleLeaveTypeChange(e, index)}
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 border-gray-300 focus:ring-gray-600`}
        >
          <option value="" disabled>Select Leave Type</option>
          {leaveTypes.map((leaveType) => (
            <option key={leaveType.leaveType} value={leaveType.leaveType}>
              {leaveType.leaveType}
            </option>
          ))}
        </select>
      </div>

      {/* Leave Count */}
      <div className="mb-5">
        <label className="block text-sm font-medium mb-2 text-gray-700">
          Set Count
        </label>
        <input
          className="w-1/2 px-2 py-2 border rounded-md shadow-sm focus:ring-2 border-gray-300 focus:ring-gray-600 text-center"
          type="number"
          value={leaveInput.leaveCount < 0 ? 0 : leaveInput.leaveCount || 0}
          onChange={(e) => handleLeaveCountChange(e, index)}
          min={0}
        />
      </div>

    </div>
  ))}
</div>

      <div className="flex justify-end space-x-3 mt-20">
        <button
          onClick={handleSetLeaves}
          className="px-5 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 focus:ring-2 focus:ring-red-600"
        >
          Save
        </button>
        <button
          onClick={handleCloseSetLeavesModal}
          className="px-5 py-2 bg-gray-600 text-white rounded-md shadow hover:bg-gray-700 focus:ring-2 focus:ring-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

{isSetAllowanceModalOpen && (
  <div
    className="fixed inset-0 bg-gray-700 bg-opacity-70 flex justify-center items-center"
    onClick={handleCloseSetAllowanceModal}
  >
    <div
      className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl h-[80vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center w-full mb-6">
        <h2 className="text-xl font-semibold text-red-600">Set Allowances</h2>

        <div className="mt-8">
          <button
            className="rounded-full bg-red-600 p-2 text-white flex items-center space-x-2"
            onClick={handleAddMoreAllowances}
          >
            Add More
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>
      </div>


      <div className="space-y-6">
  {/* Iterate over the allowance input sets */}
  {allowanceInputs.map((allowanceInput, index) => (
    <div key={index} className="flex justify-start space-x-6 items-center">
      {/* Allowance Type Dropdown */}
      <div className="mb-5">
      <label
          className={`block text-sm font-medium mb-2 ${errors.selectedAllowanceType ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="selectedAllowanceType"
        >
        Select Allowance Type
        </label>
        <select
          value={allowanceInput.selectedAllowanceType}
          onChange={(e) => handleAllowanceTypeChange(e, index)}
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.selectedAllowanceType ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`} >
          <option value="" disabled>Select Allowance Type</option>
          {allowanceTypes.map((allowanceType) => (
            <option key={allowanceType.allowanceType} value={allowanceType.allowanceType}>
              {allowanceType.allowanceType}
            </option>
          ))}
        </select>
      </div>

      {/* Allowance amount */}
      <div className="mb-5">
      <label
          className={`block text-sm font-medium mb-2 ${errors.allowanceAmount ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="allowanceAmount"
        >
        Allowance Amount (Rs.)
        </label>
        <input
        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
          errors.allowanceAmount ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
        }`}          
          type="text"
          placeholder="0.00"
          value={allowanceInputs.allowanceAmount}
          onChange={(e) => handleAllowanceAmountChange(e, index)}
        />
      </div>

    </div>
  ))}
</div>

      <div className="flex justify-end space-x-3 mt-20">
        <button
         onClick={handleSetAllowances}
          className="px-5 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 focus:ring-2 focus:ring-red-600"
        >
          Save
        </button>
        <button
          onClick={handleCloseSetAllowanceModal}
          className="px-5 py-2 bg-gray-600 text-white rounded-md shadow hover:bg-gray-700 focus:ring-2 focus:ring-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

{isSetSalaryModalOpen && selectedRecord && (
  <div
    className="fixed inset-0 bg-gray-700 bg-opacity-70 flex justify-center items-center"
    onClick={handleCloseSetSalaryModal} // Handle click outside the modal to close it
  >
    <div
      className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl h-[80vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()} // Prevent modal from closing if click inside modal content
    >
      <h2 className="text-lg font-medium mb-4 text-red-600">Set Salary Details</h2>
      {/* <form onSubmit={handleUpdateSubmit}> */}
      <form >
      
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.baseSalary ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="baseSalary"
        >
          Base Salary
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.baseSalary ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter Base Salary (Rs.)"
          defaultValue={selectedRecord.baseSalary != null ? selectedRecord.baseSalary.toFixed(2) : undefined}
          onChange={(e) => setBaseSalary(e.target.value)}
        />
        {errors.baseSalary && (
          <p className="text-red-600 text-sm mt-1">{errors.baseSalary}</p>
        )}
      </div>

      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.epf ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="epf"
        >
          EPF
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.epf ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter EPF (Rs.)"
          defaultValue={selectedRecord.epf != null ? selectedRecord.epf.toFixed(2) : undefined}
          onChange={(e) => setEpf(e.target.value === "" ? 0 : e.target.value)}
        />
        {errors.epf && (
          <p className="text-red-600 text-sm mt-1">{errors.epf}</p>
        )}
      </div>

      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.etf ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="etf"
        >
          ETF
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.etf ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter ETF (Rs.)"
          defaultValue={selectedRecord.etf != null ? selectedRecord.etf.toFixed(2) : undefined}
          onChange={(e) => setEtf(e.target.value === "" ? 0 : e.target.value)}
        />
        {errors.etf && (
          <p className="text-red-600 text-sm mt-1">{errors.etf}</p>
        )}
      </div>

      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.payeeTax ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="payeeTax"
        >
          Payee Tax
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.payeeTax ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter Payee Tax (Rs.)"
          defaultValue={selectedRecord.payeeTax != null ? selectedRecord.payeeTax.toFixed(2) : undefined}
          onChange={(e) => setPayeeTax(e.target.value === "" ? 0.00 : e.target.value)}
        />
        {errors.payeeTax && (
          <p className="text-red-600 text-sm mt-1">{errors.payeeTax}</p>
        )}
      </div>

      
        <div className="flex justify-end mt-4">
        <button
          onClick={handleSetSalary}
          className="px-5 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 focus:ring-2 focus:ring-red-600 mr-2"
        >
          Save
        </button>
          <button
            onClick={handleCloseSetSalaryModal}
            className="px-4 py-2 bg-gray-600 text-white rounded-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}


</div>

    </div>
  );
};

export default DatabasePage;

