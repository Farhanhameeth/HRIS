// TrainingPage.jsx

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchTrainings,
  fetchAllEmployees,
  getReportPersonDetails,
  submitNewTraining,
  updateTraining,
  selectTrainings,
  setSelectedRecord,
  setIsModalOpen,
  setIsUpdateModalOpen,
  setIsNewRecordOpen,
  setFilters,
  setCurrentPage,
  setItemsPerPage,
} from '../features/training/trainingSlice';
import { selectEmployeeId, selectUserId } from '../features/auth/authSlice';


const TrainingPage = () => {
  const dispatch = useDispatch();
  const trainings = useSelector(selectTrainings);
  const status = useSelector(state => state.training.status);
  const error = useSelector(state => state.training.error);
  const filters = useSelector(state => state.training.filters);
  const currentPage = useSelector(state => state.training.currentPage);
  const itemsPerPage = useSelector(state => state.training.itemsPerPage);
  const isModalOpen = useSelector(state => state.training.isModalOpen);
  const isUpdateModalOpen = useSelector(state => state.training.isUpdateModalOpen);
  const isNewRecordOpen = useSelector(state => state.training.isNewRecordOpen);
  const selectedRecord = useSelector(state => state.training.selectedRecord);

  const employees = useSelector((state) => state.training.employees); // Adjust this according to your Redux state structure
  const [selectedEmployee, setSelectedEmployee] = useState('');

  const reportTo = useSelector((state) => state.training.reportTo);

  const [courseName, setCourseName] = useState('');
  const [duration, setDuration] = useState('');
  const [mode, setMode] = useState('');
  const [cost, setCost] = useState('');
  const [priority, setPriority] = useState('');
  const [resources, setResources] = useState('');

  const userId = useSelector(selectUserId);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTrainings());
      dispatch(fetchAllEmployees());
      dispatch(getReportPersonDetails());
    }
  }, [dispatch, status]);

  //dark mode
  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  

  // useEffect(() => {
  //   if (status === 'idle') {
      
  //   }
  // }, [dispatch, status]);

  useEffect(() => {
    
    if (selectedRecord) {
      setCourseName(selectedRecord.courseName);
      setDuration(selectedRecord.duration);
      setMode(selectedRecord.mode);
      setPriority(selectedRecord.priority);
      setCost(selectedRecord.cost);
      setResources(selectedRecord.resources);
      setSelectedEmployee(selectedRecord.requester);
      // setRecordId(selectedRecord.Id);

    }
  }, [selectedRecord]);


  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  const validateForm = () => {
    const newErrors = {};

    if (!selectedEmployee) newErrors.selectedEmployee = 'Requester name is required';
    if (!courseName) newErrors.courseName = 'Course name is required';
    if (!duration) newErrors.duration = 'Course duration is required';
    else if (!/^\d+$/.test(duration)) {
      newErrors.duration = 'Duration must contain only numbers to represent no. of hours';
    }
    if (!cost) newErrors.cost = 'Cost is required';
    else if (!/^\d+(\.\d{1,2})?$/.test(cost)) {
      newErrors.cost = 'Cost must be a valid number with up to two decimal places';
    }
    if (!priority) newErrors.priority = 'Priority level is required';
    if (!mode) newErrors.mode = 'Training mode is required';

    return newErrors;
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    dispatch(setFilters({ [name]: value }));
  };

  const handleSearchByChange = (event) => {
    dispatch(setFilters({ searchBy: event.target.value }));
  };

  const handleEmployeeChange = (event) => {
    const selectedName = event.target.value;
    setSelectedEmployee(selectedName);
  };

  const handleSubmitNewRecord = async (e) => {
    e.preventDefault();
  
    // Perform validation
    const newErrors = validateForm();
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Stop submission if there are errors
    } else {
      setErrors({});
    }

    const newTraining = {
      courseName: courseName,
      duration: duration,
      mode: mode,
      requester: selectedEmployee,
      priority: priority,
      cost: cost,
      resources: resources === "" ? null : resources,
      insertBy: userId,
    };
  
    // Dispatch the submitNewResource action and handle the result
    try {
      const result = await dispatch(submitNewTraining(newTraining)).unwrap();
      console.log("Training submission successful:", result);
      alert('Training Record Submitted Successfully');
  
      // Reset form fields after successful submission
      setSelectedEmployee('');
      setCourseName('');
      setDuration('');
      setMode('');
      setPriority('');
      setCost('');
      setResources('');
    } catch (error) {
      console.error("Training submission error:", error);
      // Handle error, optionally display a message to the user
    }
  };

  const handleUpdateRecord = async (e) => {
    e.preventDefault();

    // Log selectedRecord to debug
    console.log("SELECTED RECORD: ", selectedRecord);
    console.log("SELECTED RECORD ID: ", selectedRecord?.Id);

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

    const updatedTraining = {
      courseName: courseName,
      duration: duration,
      mode: mode,
      requester: selectedEmployee,
      priority: priority,
      cost: cost,
      resources: resources === "" ? null : resources,
      updateBy: userId,
      Id: Id,
    };

    console.log("Updated Training Object: ", updatedTraining);

    try {
      const result = await dispatch(updateTraining(updatedTraining)).unwrap();
      console.log("Training update successful:", result);
      alert('Training Record Updated Successfully');
  
    } catch (error) {
      console.error("Training update error:", error);
      // Handle error, optionally display a message to the user
    }
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
    setSelectedEmployee('');
      setCourseName('');
      setDuration('');
      setMode('');
      setPriority('');
      setCost('');
      setResources('');
  dispatch(setIsNewRecordOpen(true));
};

const handleCloseNewRecord = () => {
  dispatch(setIsNewRecordOpen(false));
};

const handleOpenUpdateModal = () => {
dispatch(setIsUpdateModalOpen(true));
};

const handleCloseUpdateModal = () => {
dispatch(setIsUpdateModalOpen(false));
};

  const formatInsertDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  const filteredTrainingDetails = trainings
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

  const totalItems = filteredTrainingDetails.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTrainingDetails.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => dispatch(setCurrentPage(pageNumber));

  return (
    <div className="bg-gray-100 dark:bg-gray-900 dark:text-white min-h-screen">
    <div className="overflow-x-auto rounded-lg shadow-md bg-white p-4 ml-64 dark:bg-gray-800 dark:text-white">
      <br />
      <div className="flex items-center justify-between space-x-4 mb-4">
      <div className="flex space-x-4">
        <select
          name="searchBy"
          value={filters.searchBy}
          onChange={handleSearchByChange}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-white"
        >
          <option value="Id">Id</option>
          {/* <option value="employeeId">Employee ID</option> */}
          <option value="requester">Requester</option>
          <option value="priority">Priority</option>
          <option value="courseName">Course Name</option>
          <option value="duration">Duration</option>
          <option value="mode">Training Mode</option>
          <option value="trainingProvider">Training Provider</option>
        </select>
        <input
          type="text"
          placeholder={`Search by ${filters.searchBy}`}
          name={filters.searchBy}
          value={filters[filters.searchBy] || ''}
          onChange={handleFilterChange}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-white"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-white"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      {reportTo.some(record => record.reportPersonId == userId) && (
      <button
        className="rounded-full bg-red-600 p-2 text-white flex items-center space-x-2"
        onClick={handleNewRecordClick}
    >
        <span className="ml-2">Add Record</span>
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
    </button> )}
    </div> <br />
<div> 
<h2 className="text-lg font-bold mb-2 text-red-600 dark:text-red-400">Your Trainings</h2>

      <table className="min-w-full bg-white border border-gray-200 divide-y divide-gray-200 dark:border-gray-700 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Course Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Duration (h)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Training Provider</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Mode</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Priority</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Cost</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Resources</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
          {currentItems.map((detail) => ( (userId == detail.userId ) && (
            <tr key={detail.id} onClick={() => handleRowClick(detail)} className="cursor-pointer">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{detail.Id}</td>
              {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{detail.fullName}</td> */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{detail.courseName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{detail.duration}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{detail.trainingProvider}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{detail.mode}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{detail.priority}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{detail.cost.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{detail.resources == null ? "null" : detail.resources}</td>
            </tr> 
          )
          )) }
        </tbody>
      </table>
      </div>
      

{reportTo.some(record => record.reportPersonId == userId) && ( 
      <div><br /><br />
<h2 className="text-lg font-bold mb-2 text-red-600 dark:text-red-400">Trainings You've Set</h2>
      <table className="min-w-full bg-white border border-gray-200 divide-y divide-gray-200 dark:border-gray-700 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">ID</th>
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>                        */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Course Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Duration (h)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Requester</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Mode</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Priority</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Cost</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Resources</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
          {currentItems.map((detail) => ( (userId == detail.trainingProviderId) && (
            <tr key={detail.id} onClick={() => handleRowClick(detail)} className="cursor-pointer">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{detail.Id}</td>
              {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{detail.fullName}</td> */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{detail.courseName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{detail.duration}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{detail.requester}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{detail.mode}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{detail.priority}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{detail.cost.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{detail.resources == null ? "null" : detail.resources}</td>
            </tr> 
          )
          )) }
        </tbody>
      </table>
      </div> 
    )} <br />

      <div className="mt-4 flex justify-between">
        <div>
          <label htmlFor="itemsPerPage" className="text-sm">Items per page:</label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => dispatch(setItemsPerPage(Number(e.target.value)))}
            className="ml-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-white"
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
                  className={`px-3 py-2 border ${number === currentPage ? 'bg-gray-300 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} rounded-md shadow-sm`}
                >
                  {number}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

      {isModalOpen && selectedRecord && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center" onClick={handleCloseModal}>
  <div className="bg-white p-6 rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
    <h2 className="text-lg font-medium mb-4">Training Details</h2>
    <table className="min-w-full divide-y divide-gray-200">
      <tbody>
        <tr>
          <td className="px-6 py-3 text-sm font-medium text-gray-900">ID:</td>
          <td className="px-6 py-3 text-sm text-gray-500">{selectedRecord.Id}</td>
        </tr>
        <tr>
          <td className="px-6 py-3 text-sm font-medium text-gray-900">Employee ID:</td>
          <td className="px-6 py-3 text-sm text-gray-500">{selectedRecord.employeeId}</td>
        </tr>
        <tr>
          <td className="px-6 py-3 text-sm font-medium text-gray-900">Requester:</td>
          <td className="px-6 py-3 text-sm text-gray-500">{selectedRecord.requester}</td>
        </tr>
        <tr>
          <td className="px-6 py-3 text-sm font-medium text-gray-900">Course Name:</td>
          <td className="px-6 py-3 text-sm text-gray-500">{selectedRecord.courseName}</td>
        </tr>
        <tr>
          <td className="px-6 py-3 text-sm font-medium text-gray-900">Duration (h):</td>
          <td className="px-6 py-3 text-sm text-gray-500">{selectedRecord.duration}</td>
        </tr>
        <tr>
          <td className="px-6 py-3 text-sm font-medium text-gray-900">Mode:</td>
          <td className="px-6 py-3 text-sm text-gray-500">{selectedRecord.mode}</td>
        </tr> 
        <tr>
          <td className="px-6 py-3 text-sm font-medium text-gray-900">Priority:</td>
          <td className="px-6 py-3 text-sm text-gray-500">{selectedRecord.priority}</td>
        </tr>
        <tr>
          <td className="px-6 py-3 text-sm font-medium text-gray-900">Training Provider:</td>
          <td className="px-6 py-3 text-sm text-gray-500">{selectedRecord.trainingProvider}</td>
        </tr>
        <tr>
          <td className="px-6 py-3 text-sm font-medium text-gray-900">Cost:</td>
          <td className="px-6 py-3 text-sm text-gray-500">{selectedRecord.cost.toFixed(2)}</td>
        </tr>
        <tr>
          <td className="px-6 py-3 text-sm font-medium text-gray-900">Resources:</td>
          <td className="px-6 py-3 text-sm text-gray-500">{selectedRecord.resources == null ? "null" : selectedRecord.resources}</td>
        </tr>
        <tr>
          <td className="px-6 py-3 text-sm font-medium text-gray-900">Month/Year:</td>
          <td className="px-6 py-3 text-sm text-gray-500">{formatInsertDate(selectedRecord.insertDate)}</td>
        </tr>
      </tbody>
    </table>
    <div className="flex justify-end mt-4">
    {userId == selectedRecord.trainingProviderId && (
      <button
        onClick={handleOpenUpdateModal}
        className="px-4 py-2 bg-red-600 text-white rounded-md mr-2"
      >
        Update
      </button> )}
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
      <h2 className="text-lg font-medium mb-4">Update Training Details</h2>
      {/* <form onSubmit={handleUpdateSubmit}> */}
      <form >

        {/* Input fields pre-populated with selectedRecord's values */}
{/* Employee Selection Dropdown */}
<div className="mb-5">
    <label
          className={`block text-sm font-medium mb-2 ${errors.selectedEmployee ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="employeeSelect">
        Requester
      </label>

      <select
        value={selectedEmployee || selectedRecord.requester}
        onChange={handleEmployeeChange}
       // onChange={(e) => handleEmployeeChange(e.target.value === "" ? null : e.target.value)}

        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
          errors.selectedEmployee ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
        }`}
      >
        <option value="" disabled>Select Employee</option>
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
  
  {/* Course Name Input */}
  <div className="mb-5">
      <label
        className={`block text-sm font-medium mb-2 ${errors.courseName ? 'text-red-600' : 'text-gray-700'}`}
        htmlFor="courseName"
      >
        Course Name
      </label>
      <input
        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
          errors.courseName ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
        }`}
        type="text"
        placeholder="Enter Course Name"
        defaultValue={selectedRecord.courseName}
        onChange={(e) => setCourseName(e.target.value)}
      />
      {errors.courseName && (
        <p className="text-red-600 text-sm mt-1">{errors.courseName}</p>
      )}
    </div>

{/* Duration Input */}
<div className="mb-5">
      <label
        className={`block text-sm font-medium mb-2 ${errors.duration ? 'text-red-600' : 'text-gray-700'}`}
        htmlFor="duration"
      >
        Duration
      </label>
      <input
        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
          errors.duration ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
        }`}
        type="text"
        placeholder="Enter Duration (h)"
        defaultValue={selectedRecord.duration}
        onChange={(e) => setDuration(e.target.value)}
      />
      {errors.duration && (
        <p className="text-red-600 text-sm mt-1">{errors.duration}</p>
      )}
    </div>

    {/* Training mode Selection Dropdown */}
    <div className="mb-5">
    <label
        className={`block text-sm font-medium mb-2 ${errors.mode ? 'text-red-600' : 'text-gray-700'}`}
        htmlFor="modeSelect">
        Training Mode
      </label>

      <select
        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
          errors.mode ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
        }`}
        value={mode || selectedRecord.mode}
        onChange={(e) => setMode(e.target.value)}
      >
        <option value="" disabled>Select Training Mode</option>
        <option value="Online">Online</option>
        <option value="Physical">Physical</option>
      </select>
      {errors.mode && (
          <p className="text-red-600 text-sm mt-1">{errors.mode}</p>
        )}
    </div>

    {/* Priority Level Selection Dropdown */}
    <div className="mb-5">
    <label
        className={`block text-sm font-medium mb-2 ${errors.priority ? 'text-red-600' : 'text-gray-700'}`}
        htmlFor="prioritySelect">
        Priority Level
      </label>

      <select
        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
          errors.priority ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
        }`}
        value={priority || selectedRecord.priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="" disabled>Select Priority Level</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      {errors.priority && (
          <p className="text-red-600 text-sm mt-1">{errors.priority}</p>
        )}
    </div>

    {/* Cost Input */}
    <div className="mb-5">
      <label
        className={`block text-sm font-medium mb-2 ${errors.cost ? 'text-red-600' : 'text-gray-700'}`}
        htmlFor="cost"
      >
        Cost
      </label>
      <input
        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
          errors.cost ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
        }`}
        type="text"
        placeholder="Enter Cost (Rs.)"
        defaultValue={selectedRecord.cost}
        onChange={(e) => setCost(e.target.value)}
      />
      {errors.cost && (
        <p className="text-red-600 text-sm mt-1">{errors.cost}</p>
      )}
    </div>

    {/* Resources Input */}
    <div className="mb-5">
      <label
      className={`block text-sm font-medium mb-2 'text-gray-700'`}         
      htmlFor="resources">
        Resources
      </label>
      <input
        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 'border-gray-300 focus:ring-gray-600'
        `}
        type="text"
        placeholder="Enter Resources (Links/Resource names etc.)"
        value={resources || ""}
        onChange={(e) => setResources(e.target.value === "" ? null : e.target.value)}
      />
    </div>
      

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
  <h2 className="text-xl font-semibold text-red-600 mb-6">Add New Resource</h2>

    {/* Employee Selection Dropdown */}
    <div className="mb-5">
    <label
          className={`block text-sm font-medium mb-2 ${errors.selectedEmployee ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="employeeSelect">
        Requester
      </label>

      <select
        value={selectedEmployee}
        onChange={handleEmployeeChange}
       // onChange={(e) => handleEmployeeChange(e.target.value === "" ? null : e.target.value)}

        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
          errors.selectedEmployee ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
        }`}
      >
        <option value="" disabled>Select Employee</option>
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
  
  {/* Course Name Input */}
  <div className="mb-5">
      <label
        className={`block text-sm font-medium mb-2 ${errors.courseName ? 'text-red-600' : 'text-gray-700'}`}
        htmlFor="courseName"
      >
        Course Name
      </label>
      <input
        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
          errors.courseName ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
        }`}
        type="text"
        placeholder="Enter Course Name"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
      />
      {errors.courseName && (
        <p className="text-red-600 text-sm mt-1">{errors.courseName}</p>
      )}
    </div>

{/* Duration Input */}
<div className="mb-5">
      <label
        className={`block text-sm font-medium mb-2 ${errors.duration ? 'text-red-600' : 'text-gray-700'}`}
        htmlFor="duration"
      >
        Duration
      </label>
      <input
        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
          errors.duration ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
        }`}
        type="text"
        placeholder="Enter Duration (h)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />
      {errors.duration && (
        <p className="text-red-600 text-sm mt-1">{errors.duration}</p>
      )}
    </div>

    {/* Training mode Selection Dropdown */}
    <div className="mb-5">
    <label
        className={`block text-sm font-medium mb-2 ${errors.mode ? 'text-red-600' : 'text-gray-700'}`}
        htmlFor="modeSelect">
        Training Mode
      </label>

      <select
        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
          errors.mode ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
        }`}
        value={mode}
        onChange={(e) => setMode(e.target.value)}
      >
        <option value="" disabled>Select Training Mode</option>
        <option value="Online">Online</option>
        <option value="Physical">Physical</option>
      </select>
      {errors.mode && (
          <p className="text-red-600 text-sm mt-1">{errors.mode}</p>
        )}
    </div>

    {/* Priority Level Selection Dropdown */}
    <div className="mb-5">
    <label
        className={`block text-sm font-medium mb-2 ${errors.priority ? 'text-red-600' : 'text-gray-700'}`}
        htmlFor="prioritySelect">
        Priority Level
      </label>

      <select
        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
          errors.priority ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
        }`}
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="" disabled>Select Priority Level</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      {errors.priority && (
          <p className="text-red-600 text-sm mt-1">{errors.priority}</p>
        )}
    </div>

    {/* Cost Input */}
    <div className="mb-5">
      <label
        className={`block text-sm font-medium mb-2 ${errors.cost ? 'text-red-600' : 'text-gray-700'}`}
        htmlFor="cost"
      >
        Cost
      </label>
      <input
        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
          errors.cost ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
        }`}
        type="text"
        placeholder="Enter Cost (Rs.)"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
      />
      {errors.cost && (
        <p className="text-red-600 text-sm mt-1">{errors.cost}</p>
      )}
    </div>

    {/* Resources Input */}
    <div className="mb-5">
      <label
      className={`block text-sm font-medium mb-2 'text-gray-700'`}         
      htmlFor="resources">
        Resources
      </label>
      <input
        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 'border-gray-300 focus:ring-gray-600'
        `}
        type="text"
        placeholder="Enter Resources (Links/Resource names etc.)"
        value={resources || ""}
        onChange={(e) => setResources(e.target.value === "" ? null : e.target.value)}
      />
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

    </div>
  );
};

export default TrainingPage;
