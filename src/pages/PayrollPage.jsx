// PayrollPage.jsx

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchAllPayrolls, // Import the new function
  fetchPayrolls,
  fetchAllEmployees,
  fetchAllAllowanceTypes,
  fetchAllDeductionTypes,
  getActiveEMP,
  submitPayrollRecord,
  calculatePayrollRecord,
  selectPayrolls,
  setSelectedRecord,
  setIsModalOpen,
  setIsNewRecordOpen,
  setFilters,
  setCurrentPage,
  setItemsPerPage,
  updatePayrollPopup // 
} from '../features/payroll/payrollSlice';


import DataTable from '../components/reusable/DataTable'; // Import the DataTable component
import { selectUserId } from '../features/auth/authSlice';

const PayrollPage = () => {
  const dispatch = useDispatch();
  const payrolls = useSelector(selectPayrolls);
  const status = useSelector(state => state.payroll.status);
  const error = useSelector(state => state.payroll.error);
  const filters = useSelector(state => state.payroll.filters);
  const currentPage = useSelector(state => state.payroll.currentPage);
  const itemsPerPage = useSelector(state => state.payroll.itemsPerPage);
  const isModalOpen = useSelector(state => state.payroll.isModalOpen);
  const isNewRecordOpen = useSelector(state => state.payroll.isNewRecordOpen);
  const selectedRecord = useSelector(state => state.payroll.selectedRecord);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  

  const employees = useSelector((state) => state.payroll.employees);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employeeId, setEmployeeId] = useState('');

  const allowanceTypes = useSelector((state) => state.payroll.allowanceTypes);
  const [selectedAllowanceType, setSelectedAllowanceType] = useState('');
  const [allowanceAmount, setAllowanceAmount] = useState('');

  const deductionTypes = useSelector((state) => state.payroll.deductionTypes);
  const [selectedDeductionType, setSelectedDeductionType] = useState('');
  const [deductionAmount, setDeductionAmount] = useState('');

  const [baseSalary, setBaseSalary] = useState('');
  const [epf, setEpf] = useState('');
  const [etf, setEtf] = useState('');
  const [payeeTax, setPayeeTax] = useState('');

  const empIDs = useSelector((state) => state.payroll.empIDs);
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const [readyToCalculate, setReadyToCalculate] = useState(false);
  const userId = useSelector(selectUserId);
  const [errors, setErrors] = useState({});
  const [editableRecord, setEditableRecord] = useState(null);


  useEffect(() => {
    if (status === 'idle') {
      dispatch(getActiveEMP());
      dispatch(fetchAllEmployees());
      dispatch(fetchPayrolls());
      dispatch(fetchAllPayrolls()); // Fetch all payrolls
      dispatch(fetchAllAllowanceTypes());
      dispatch(fetchAllDeductionTypes());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (selectedRecord) {
      setEditableRecord({ ...selectedRecord });
    }
  }, [selectedRecord]);

   // Apply dark mode globally
    useEffect(() => {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }, [darkMode]);

  useEffect(() => {
    // Trigger payroll calculation when both filters are set and employee data is available
    if (readyToCalculate && empIDs.length > 0) {
      handleCalculatePayrollRecord();
      setReadyToCalculate(false);
    }
  }, [readyToCalculate, empIDs]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  const handleEmployeeChange = (event) => {
    const selectedName = event.target.value;
    setSelectedEmployee(selectedName);
    const selectedEmp = employees.find(emp => emp.name === selectedName);
    if (selectedEmp) {
      setEmployeeId(selectedEmp.employeeId);
    } else {
      setEmployeeId('');
    }
  };

  const handleAllowanceTypeChange = (event) => {
    setSelectedAllowanceType(event.target.value);
  };

  const handleDeductionTypeChange = (event) => {
    setSelectedDeductionType(event.target.value);
  };

  // Helper function to generate a range of years
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 5;
    const years = [];
    for (let year = startYear; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };

  // Define column configuration  (make sure keys match the data) @induwara
  const payrollColumns = [
    { header: 'Id', accessor: 'Id' },
    { header: 'Emp ID', accessor: 'employeeId' },
    { header: 'Name', accessor: 'firstName' },
    {
      header: 'Base Salary',
      accessor: 'baseSalary',
      render: row => row.baseSalary ? row.baseSalary.toFixed(2) : ''
    },
    {
      header: 'Allowance',
      accessor: 'allowanceAmount', // Make sure this key matches your data
      render: row => row.allowanceAmount ? row.allowanceAmount.toFixed(2) : ''
    },
    {
      header: 'Deduction',
      accessor: 'deductionAmount', // Make sure this key matches your data
      render: row => row.deductionAmount ? row.deductionAmount.toFixed(2) : ''
    },
    {
      header: 'Net Salary',
      accessor: 'NetSalary',
      render: row => (row.baseSalary + row.allowanceAmount - row.deductionAmount).toFixed(2)
    }
  ];

  const handleSubmitNewRecord = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    } else {
      setErrors({});
    }

    const newPayrollRecord = {
      employeeId,
      allowanceAmount,
      allowanceType: selectedAllowanceType,
      deductionAmount,
      deductionType: selectedDeductionType,
      baseSalary,
      epf,
      etf,
      payeeTax,
      insertBy: 1,
    };

    try {
      const result = await dispatch(submitPayrollRecord(newPayrollRecord)).unwrap();
      console.log("Payroll Record submission successful:", result);
      alert('Payroll Record Submitted');
    } catch (error) {
      console.error("Payroll Record submission error:", error);
    }
    setSelectedEmployee('');
    setEmployeeId('');
    setAllowanceAmount('');
    setDeductionAmount('');
    setBaseSalary('');
    setEpf('');
    setEtf('');
    setPayeeTax('');
    setSelectedAllowanceType('');
    setSelectedDeductionType('');
  };

  const handleCalculatePayrollRecord = async (e) => {
    const monthNames = {
      January: '01',
      February: '02',
      March: '03',
      April: '04',
      May: '05',
      June: '06',
      July: '07',
      August: '08',
      September: '09',
      October: '10',
      November: '11',
      December: '12'
    };

    const year = filters.year;
    const month = monthNames[filters.month];
    const day = '01';
    const formattedDate = `${year}-${month}-${day}`;
    console.log(formattedDate);

    for (const employee of empIDs) {
      const employeeId = employee.employeeId;
      const calculatePayrollData = {
        employeeId,
        insertBy: userId,
        selectedYearMonth: formattedDate,
      };
      console.log(calculatePayrollData);
      try {
        const result = await dispatch(calculatePayrollRecord(calculatePayrollData)).unwrap();
        const payrollData = Array.isArray(result) ? result : [];
        dispatch(setPayrollRecords(payrollData));
        console.log(`Payroll Record calculation successful for Employee ID: ${employeeId}`, result);
        alert('Payroll Calculated');
      } catch (error) {
        console.error("Payroll Record calculation error:", error);
      }
    }
  };

  console.log('PAYROLLS:', payrolls);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    dispatch(setFilters({ [name]: value }));
    const updatedFilters = { ...filters, [name]: value };
    if (updatedFilters.month && updatedFilters.year) {
      setReadyToCalculate(true);
    }
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
    dispatch(setIsNewRecordOpen(true));
  };

  const handleCloseNewRecord = () => {
    dispatch(setIsNewRecordOpen(false));
  };

  const formatInsertDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

const handleUpdateRecord = async () => {
  try {
    const insertDate = new Date(editableRecord.insertDate);
    const insertYearMonth = insertDate.toISOString().slice(0, 10); //Correct format

    const payload = {
      employeeId: editableRecord.employeeId,
      insertYearMonth,
      baseSalary: editableRecord.baseSalary,
      epf: editableRecord.epf,
      etf: editableRecord.etf,
      payeeTax: editableRecord.payeeTax,
      allowanceAmount: editableRecord.allowanceAmount,
      deductionAmount: editableRecord.deductionAmount,
      updateBy: userId,
    };
    console.log('Sending payload:', payload); //for debugging


    const result = await dispatch(updatePayrollPopup(payload)).unwrap();
    console.log("Update result:", result); // 👈 See what backend returns
    alert('Payroll updated successfully');
    dispatch(fetchAllPayrolls());
    handleCloseModal();
  } catch (error) {
    console.error('Update failed:', error);
    alert('Payroll update failed');
  }
};

  // Apply filters on payrolls (make sure keys match your payroll objects)
  const filteredPayrollDetails = payrolls
    .filter((detail) => {
      if (filters.status && filters.status !== 'all') {
        if (filters.status === 'active') {
          return detail.isActive === 1;
        } else if (filters.status === 'inactive') {
          return detail.isActive === 0;
        }
      }
      return true;
    })


    .filter((detail) => {
      // Use the searchBy field from filters; ensure the option values match the payroll object keys
      const searchBy = filters.searchBy || '';
      const searchTerm = filters[searchBy]?.toLowerCase() || '';
      const valueToSearch = detail[searchBy] != null ? detail[searchBy].toString().toLowerCase() : '';
      return valueToSearch.includes(searchTerm);
    })
    .filter((detail) => {
      // If month and year filters are set, filter based on the insertDate field
      if (filters.month && filters.year) {
        const date = new Date(detail.insertDate);
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear().toString();
        return month === filters.month && year === filters.year;
      }
      return true;
    });

  const totalItems = filteredPayrollDetails.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayrollDetails.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => dispatch(setCurrentPage(pageNumber));

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
    <div className="overflow-x-auto rounded-lg shadow-md bg-white p-4 ml-64 dark:bg-gray-800 dark:text-gray-200">
      <div className="flex items-center space-x-4 mb-4">
        <select
          name="month"
          value={filters.month || ''}
          onChange={handleFilterChange}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-200"
        >
          <option value="" disabled> Select Month </option>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
        <select
          name="year"
          value={filters.year || ''}
          onChange={handleFilterChange}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-200"
        >
          <option value="" disabled>Select Year</option>
          {generateYears().map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      <hr className="my-4" />
      <div className="flex items-center justify-between space-x-4 mb-4">
        <div className="flex space-x-4">
          <select
            name="searchBy"
            value={filters.searchBy || ''}
            onChange={handleSearchByChange}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-200"
          >
            {/* Make sure the option values match the payroll object keys */}
            <option value="payrollId">ID</option>
            <option value="employeeId">Employee ID</option>
            <option value="firstName">Name</option>
            <option value="baseSalary">Base Salary</option>
            <option value="allowanceAmount">Allowance</option>
            <option value="deductionAmount">Deduction</option>
            {/* If you have a status field, include it here */}
            <option value="status">Status</option>
          </select>
          <input
            type="text"
            placeholder={`Search by ${filters.searchBy || 'field'}`}
            name={filters.searchBy}
            value={filters[filters.searchBy] || ''}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-200"
          />
          <select
            name="status"
            value={filters.status || 'all'}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-200"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Use currentItems (filtered & paginated data) */}
      <DataTable
        columns={payrollColumns}
        data={currentItems}
        onRowClick={handleRowClick}
      />

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
                  className={`px-3 py-1 rounded-md ${currentPage === number ? 'bg-gray-300' : 'bg-white'} border border-gray-300 dark:bg-gray-700 dark:text-gray-200`}
                >
                  {number}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isModalOpen && selectedRecord && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center" onClick={handleCloseModal}>
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 dark:bg-gray-800" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-medium mb-4">Payroll Details</h2>
            <table className="min-w-full divide-y divide-gray-200">
  <tbody>
    <tr>
      <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-gray-200">ID:</td>
      <td className="px-6 py-3 text-sm text-gray-500 dark:text-gray-300">{editableRecord?.Id}</td>
    </tr>
    <tr>
      <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-gray-200">Employee ID:</td>
      <td className="px-6 py-3 text-sm text-gray-500 dark:text-gray-300">{editableRecord?.employeeId}</td>
    </tr>
    <tr>
      <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-gray-200">Name:</td>
      <td className="px-6 py-3 text-sm text-gray-500 dark:text-gray-300">{editableRecord?.firstName}</td>
    </tr>
    <tr>
      <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-gray-200">Base Salary:</td>
      <td className="px-6 py-3 text-sm text-gray-500 dark:text-gray-300">
        <input
          type="number"
          value={editableRecord?.baseSalary || 0}
          onChange={(e) => setEditableRecord({ ...editableRecord, baseSalary: parseFloat(e.target.value) || 0 })}
          className="w-full bg-transparent border border-gray-300 rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
        />
      </td>
    </tr>
    <tr>
      <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-gray-200">Allowance Amount:</td>
      <td className="px-6 py-3 text-sm text-gray-500 dark:text-gray-300">
        <input
          type="number"
          value={editableRecord?.allowanceAmount || 0}
          onChange={(e) => setEditableRecord({ ...editableRecord, allowanceAmount: parseFloat(e.target.value) || 0 })}
          className="w-full bg-transparent border border-gray-300 rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
        />
      </td>
    </tr>
    <tr>
      <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-gray-200">Deduction Amount:</td>
      <td className="px-6 py-3 text-sm text-gray-500 dark:text-gray-300">
        <input
          type="number"
          value={editableRecord?.deductionAmount || 0}
          onChange={(e) => setEditableRecord({ ...editableRecord, deductionAmount: parseFloat(e.target.value) || 0 })}
          className="w-full bg-transparent border border-gray-300 rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
        />
      </td>
    </tr>
    <tr>
      <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-gray-200">EPF:</td>
      <td className="px-6 py-3 text-sm text-gray-500 dark:text-gray-300">
        <input
          type="number"
          value={editableRecord?.epf || 0}
          onChange={(e) => setEditableRecord({ ...editableRecord, epf: parseFloat(e.target.value) || 0 })}
          className="w-full bg-transparent border border-gray-300 rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
        />
      </td>
    </tr>
    <tr>
      <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-gray-200">ETF:</td>
      <td className="px-6 py-3 text-sm text-gray-500 dark:text-gray-300">
        <input
          type="number"
          value={editableRecord?.etf || 0}
          onChange={(e) => setEditableRecord({ ...editableRecord, etf: parseFloat(e.target.value) || 0 })}
          className="w-full bg-transparent border border-gray-300 rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
        />
      </td>
    </tr>
    <tr>
      <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-gray-200">Payee Tax:</td>
      <td className="px-6 py-3 text-sm text-gray-500 dark:text-gray-300">
        <input
          type="number"
          value={editableRecord?.payeeTax || 0}
          onChange={(e) => setEditableRecord({ ...editableRecord, payeeTax: parseFloat(e.target.value) || 0 })}
          className="w-full bg-transparent border border-gray-300 rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
        />
      </td>
    </tr>
    <tr>
      <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-gray-200">Net Salary:</td>
      <td className="px-6 py-3 text-sm text-gray-500 dark:text-gray-300">
        {((editableRecord?.baseSalary || 0) + (editableRecord?.allowanceAmount || 0) - (editableRecord?.deductionAmount || 0)).toFixed(2)}
      </td>
    </tr>
    <tr>
      <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-gray-200">Month/Year:</td>
      <td className="px-6 py-3 text-sm text-gray-500 dark:text-gray-300">{formatInsertDate(editableRecord?.insertDate)}</td>
    </tr>
  </tbody>
</table>

            <div className="flex justify-end mt-4">
            <button
  onClick={handleUpdateRecord}
  className="px-4 py-2 bg-blue-600 text-white rounded-md mr-2"
>
  Update
</button>
              <button onClick={handleCloseModal} className="px-4 py-2 bg-red-600 text-white rounded-md">Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
    </div>
  );
};

export default PayrollPage;
