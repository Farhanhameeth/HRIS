
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchResources,
  fetchAllResourceTypes,
  fetchAllUnitNames,
  fetchAllEmployees,
  submitNewResource,
  updateResource,
  selectResources,
  setSelectedRecord,
  setIsModalOpen,
  setIsUpdateModalOpen,
  setIsNewRecordOpen,
  setFilters,
  setCurrentPage,
  setItemsPerPage,
} from '../features/resource/resourceSlice';
import { selectEmployeeId, selectUserId } from '../features/auth/authSlice';

const ResourcesPage = () => {
  const dispatch = useDispatch();
  const resources = useSelector(selectResources);
  const status = useSelector(state => state.resource.status);
  const error = useSelector(state => state.resource.error);
  const filters = useSelector(state => state.resource.filters);
  const currentPage = useSelector(state => state.resource.currentPage);
  const itemsPerPage = useSelector(state => state.resource.itemsPerPage);
  const isModalOpen = useSelector(state => state.resource.isModalOpen);
  const isUpdateModalOpen = useSelector(state => state.resource.isUpdateModalOpen);
  const isNewRecordOpen = useSelector(state => state.resource.isNewRecordOpen);
  const selectedRecord = useSelector(state => state.resource.selectedRecord);

  const resourceTypes = useSelector((state) => state.resource.resourceTypes); // Adjust this according to your Redux state structure
  const [selectedResourceType, setSelectedResourceType] = useState('');

  const unitNames = useSelector((state) => state.resource.unitNames); // Adjust this according to your Redux state structure
  const [selectedUnitName, setSelectedUnitName] = useState('');

  const employees = useSelector((state) => state.resource.employees); // Adjust this according to your Redux state structure
  const [selectedEmployee, setSelectedEmployee] = useState('');
  // const [employeeId, setEmployeeId] = useState('');
 
  const [serialNo, setSerialNo] = useState('');
  const [warrentyStartDate, setWarrentyStartDate] = useState('');
  const [warrentyEndDate, setWarrentyEndDate] = useState('');
  const [price, setPrice] = useState('');
  const [, setMaintainBy] = useState('');
  const [brand, setBrand] = useState('');
  // const [recordId, setRecordId] = useState('');
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  const userId = useSelector(selectUserId);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchResources());
      dispatch(fetchAllResourceTypes());
      dispatch(fetchAllUnitNames());
      dispatch(fetchAllEmployees());
    }
  }, [dispatch, status]);

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
    
    if (selectedRecord) {
      setPrice(selectedRecord.price);
      setBrand(selectedRecord.brand);
      setSerialNo(selectedRecord.serialNo);
      setSelectedUnitName(selectedRecord.unitName);
      setSelectedResourceType(selectedRecord.resourceType);
      setWarrentyStartDate(selectedRecord.warrentyStartDate);
      setWarrentyEndDate(selectedRecord.warrentyEndDate);
      setSelectedEmployee(selectedRecord.allocatedUserName);
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

    if (!selectedResourceType) newErrors.selectedResourceType = 'Resource type is required';
    if (!selectedUnitName) newErrors.selectedUnitName = 'Unit name is required';
    if (!serialNo) newErrors.serialNo = 'Serial number is required';
    if (!price) newErrors.price = 'Price is required';
    else if (!/^\d+(\.\d{1,2})?$/.test(price)) {
      newErrors.price = 'Price must be a valid number with up to two decimal places';
    }
    if (!brand) newErrors.brand = 'Brand name is required';
    // if (!maintainBy) newErrors.maintainBy = 'Maintenance information is required';

    return newErrors;
  };

  const handleResourceTypeChange = (event) => {
    const selectedRT = event.target.value;
    setSelectedResourceType(selectedRT);
  
  };

  const handleUnitNameChange = (event) => {
    const selectedUN = event.target.value;
    setSelectedUnitName(selectedUN);
  
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

    const newResource = {
      serialNo: serialNo,
      resourceType: selectedResourceType,
      warrentyStartDate: warrentyStartDate === "" ? null : warrentyStartDate,
      warrentyEndDate: warrentyEndDate === "" ? null : warrentyEndDate,
      price: price,
      unitName: selectedUnitName,
      maintainBy: userId,
      brand: brand,
      insertBy: userId,
    };
  
    // Dispatch the submitNewResource action and handle the result
    try {
      const result = await dispatch(submitNewResource(newResource)).unwrap();
      console.log("Resource submission successful:", result);
      alert('Resource Record Submitted');
  
      // Reset form fields after successful submission
      setSelectedResourceType('');
      setSerialNo('');
      setWarrentyStartDate('');
      setWarrentyEndDate('');
      setPrice('');
      setMaintainBy('');
      setBrand('');
      setSelectedUnitName('');
    } catch (error) {
      console.error("Resource submission error:", error);
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

    const updatedResource = {
      serialNo: serialNo,
      resourceType: selectedResourceType,
      warrentyStartDate: warrentyStartDate === "" ? null : warrentyStartDate,
      warrentyEndDate: warrentyEndDate === "" ? null : warrentyEndDate,
      price: price,
      unitName: selectedUnitName,
      brand: brand,
      maintainBy: userId,
      updateBy: userId,
      Id: Id,  // Ensure the correct Id is being assigned
      allocatedUser: selectedEmployee === "" ? null : selectedEmployee
    };

    console.log("Updated Resource Object: ", updatedResource);

    try {
      const result = await dispatch(updateResource(updatedResource)).unwrap();
      console.log("Resource update successful:", result);
      alert('Resource Record Updated Successfully');
  
    } catch (error) {
      console.error("Resource update error:", error);
      // Handle error, optionally display a message to the user
    }
};

  // Handler to open the update modal
const handleOpenUpdateModal = () => {
  // dispatch(setUpdateData(selectedRecord));
  if(selectedRecord.allocatedUserName == 'NA'){
    setSelectedEmployee('');
  }
  dispatch(setIsUpdateModalOpen(true));
};

// Handler to close the update modal
const handleCloseUpdateModal = () => {
  dispatch(setIsUpdateModalOpen(false));
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
      setSelectedResourceType('');
      setSerialNo('');
      setWarrentyStartDate('');
      setWarrentyEndDate('');
      setPrice('');
      setMaintainBy('');
      setBrand('');
      setSelectedUnitName('');
    // dispatch(setSelectedRecord(detail));
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

  const filteredResourceDetails = resources
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


  const totalItems = filteredResourceDetails.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResourceDetails.slice(indexOfFirstItem, indexOfLastItem);


  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => dispatch(setCurrentPage(pageNumber));

  return (
    <div className="bg-gray-100 dark:bg-gray-800  min-h-screen">
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
            <option value="serialNo">Serial No</option>
            <option value="resourceType">Resource Type</option>
            <option value="unitName">Unit Name</option>
            <option value="brand">Brand</option>
            <option value="warrentyStartDate">Warrenty Start Date</option>
            <option value="warrentyEndDate">Warrenty End Date</option>
            <option value="price">Price</option>

        </select>
        <input
            type="text"
            placeholder={`Search by ${filters.searchBy}`}
            name={filters.searchBy}
            value={filters[filters.searchBy]}
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

    <button
        className="rounded-full bg-red-600 p-2 text-white flex items-center space-x-2"
        onClick={handleNewRecordClick}
    >
        <span className="ml-2">Add Resource</span>
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Serial No</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Resource Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Brand</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Warranty Start Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Warranty End Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Price (Rs.)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Allocated User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Unit Name</th>

          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
          {currentItems.map((detail) => (
            <tr key={detail.Id} onClick={() => handleRowClick(detail)} className="cursor-pointer">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{detail.Id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{detail.serialNo}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{detail.resourceType}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{detail.brand}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{formatInsertDate(detail.warrentyStartDate) == 'January 1, 1970'? 'NA' : formatInsertDate(detail.warrentyStartDate)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{formatInsertDate(detail.warrentyEndDate) == 'January 1, 1970'? 'NA' : formatInsertDate(detail.warrentyEndDate)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{detail.price.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{detail.allocatedUserName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{detail.unitName}</td>


            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between dark:text-white">
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
                className={`px-3 py-1 rounded-md ${currentPage === number ? 'bg-gray-300' : 'bg-white'} border border-gray-300`}
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
        // Below onclick will handle clicks outside the modal
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center" onClick={handleCloseModal} >
    {/* Below onclick will prevent the modal from closing if the click is inside the modal content */}
    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3" onClick={(e) => e.stopPropagation()}>
      <h2 className="text-lg font-medium mb-4">Resource Details</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <tbody>
          <tr>
            <td className="px-6 py-3 text-sm font-medium text-gray-900">ID:</td>
            <td className="px-6 py-3 text-sm text-gray-500">{selectedRecord.Id}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 text-sm font-medium text-gray-900">Serial No:</td>
            <td className="px-6 py-3 text-sm text-gray-500">{selectedRecord.serialNo}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 text-sm font-medium text-gray-900">Resource Type:</td>
            <td className="px-6 py-3 text-sm text-gray-500">{selectedRecord.resourceType}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 text-sm font-medium text-gray-900">Brand:</td>
            <td className="px-6 py-3 text-sm text-gray-500">{selectedRecord.brand}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 text-sm font-medium text-gray-900">Warranty Start Date:</td>
            <td className="px-6 py-3 text-sm text-gray-500">{formatInsertDate(selectedRecord.warrentyStartDate) == 'January 1, 1970'? 'NA' : formatInsertDate(selectedRecord.warrentyStartDate)}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 text-sm font-medium text-gray-900">Warranty End Date:</td>
            <td className="px-6 py-3 text-sm text-gray-500">{formatInsertDate(selectedRecord.warrentyEndDate) == 'January 1, 1970'? 'NA' : formatInsertDate(selectedRecord.warrentyEndDate)}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 text-sm font-medium text-gray-900">Price (Rs.):</td>
            <td className="px-6 py-3 text-sm text-gray-500">{selectedRecord.price.toFixed(2)}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 text-sm font-medium text-gray-900">Allocated User:</td>
            <td className="px-6 py-3 text-sm text-gray-500">{selectedRecord.allocatedUserName}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 text-sm font-medium text-gray-900">Unit Name:</td>
            <td className="px-6 py-3 text-sm text-gray-500">{selectedRecord.unitName}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 text-sm font-medium text-gray-900">Insert Date:</td>
            <td className="px-6 py-3 text-sm text-gray-500">{formatInsertDate(selectedRecord.insertDate)}</td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-end mt-4">
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
      <h2 className="text-lg font-medium mb-4">Update Resource Details</h2>
      {/* <form onSubmit={handleUpdateSubmit}> */}
      <form >

        {/* Input fields pre-populated with selectedRecord's values */}

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

        <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.selectedResourceType ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="resourceSelect"
        >
          Select Resource Type
        </label>
        <select
          value={selectedResourceType || selectedRecord.resourceType}
          onChange={handleResourceTypeChange}
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.selectedResourceType ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
        >
          <option value="" disabled>Select Resource Type</option>
          {resourceTypes.map((resourceType) => (
            <option key={resourceType.type} value={resourceType.type}>
              {resourceType.type}
            </option>
          ))}
        </select>
        {errors.selectedResourceType && (
          <p className="text-red-600 text-sm mt-1">{errors.selectedResourceType}</p>
        )}
      </div>

      {/* Brand Name Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.brand ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="brand"
        >
          Brand Name
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.brand ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter Brand Name"
          defaultValue={selectedRecord.brand}
          // value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
        {errors.brand && (
          <p className="text-red-600 text-sm mt-1">{errors.brand}</p>
        )}
      </div>

      {/* Serial No Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.serialNo ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="serialNo"
        >
          Serial No
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.serialNo ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter Serial No"
          defaultValue={selectedRecord.serialNo}
          onChange={(e) => setSerialNo(e.target.value)}
        />
        {errors.serialNo && (
          <p className="text-red-600 text-sm mt-1">{errors.serialNo}</p>
        )}
      </div>

      {/* Warranty Start Date Input */}
      <div className="mb-5">
        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="warrantyStartDate">
          Warranty Start Date
        </label>
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-gray-600 focus:border-red-600"
          type="date"
          placeholder="Enter Warranty Start Date"
          defaultValue={selectedRecord.warrentyStartDate ? new Date(new Date(selectedRecord.warrentyStartDate).setDate(new Date(selectedRecord.warrentyStartDate).getDate() + 1)).toISOString().split('T')[0] : ''}
          onChange={(e) => setWarrentyStartDate(e.target.value === "" ? null : e.target.value)}
        />
      </div>


      {/* Warranty End Date Input */}
  
      <div className="mb-5">
        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="warrantyEndDate">
          Warranty End Date
        </label>
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-gray-600 focus:border-red-600"
          type="date"
          placeholder="Enter Warranty End Date"
          defaultValue={selectedRecord.warrentyEndDate ? new Date(new Date(selectedRecord.warrentyEndDate).setDate(new Date(selectedRecord.warrentyEndDate).getDate() + 1)).toISOString().split('T')[0] : ''}
          onChange={(e) => setWarrentyEndDate(e.target.value === "" ? null : e.target.value)}
        />
      </div>

      {/* Price Input */}
      <div className="mb-5">
      <label
        className={`block text-sm font-medium mb-2 ${errors.price ? 'text-red-600' : 'text-gray-700'}`}
        htmlFor="price"
      >
        Price (Rs.)
      </label>
      <input
        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
          errors.price ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
        }`}
        type="text"
        placeholder="Enter Price (Rs.)"
        defaultValue={selectedRecord.price.toFixed(2)}
        // value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      {errors.price && (  
        <p className="text-red-600 text-sm mt-1">{errors.price}</p>
      )}
    </div>

    {/* Employee Selection Dropdown */}
    <div className="mb-5">
      <label className={`block text-sm font-medium mb-2 'text-gray-700'`} 
      htmlFor="employeeSelect">
        Allocate User
      </label>

      <select
        defaultValue={selectedEmployee || ""}
        // onChange={handleEmployeeChange}
        onChange={(e) => handleEmployeeChange(e.target.value === "" ? null : e.target.value)}

        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 'border-gray-300 focus:ring-gray-600'
        `}
      >
        <option value="" disabled>Select Employee</option>
        {employees.map((employee) => (
          <option key={employee.name} value={employee.name}>
            {employee.name}
          </option>
        ))}
      </select>
      {/* {errors.selectedEmployee && (
          <p className="text-red-600 text-sm mt-1">{errors.selectedEmployee}</p>
        )} */}
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
    <h2 className="text-xl font-semibold text-red-600 mb-6">Add New Resource</h2>

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
    
    {/* Resource Type Selection Dropdown */}
    <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.selectedResourceType ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="resourceSelect"
        >
          Select Resource Type
        </label>
        <select
          value={selectedResourceType}
          onChange={handleResourceTypeChange}
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.selectedResourceType ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
        >
          <option value="" disabled>Select Resource Type</option>
          {resourceTypes.map((resourceType) => (
            <option key={resourceType.type} value={resourceType.type}>
              {resourceType.type}
            </option>
          ))}
        </select>
        {errors.selectedResourceType && (
          <p className="text-red-600 text-sm mt-1">{errors.selectedResourceType}</p>
        )}
      </div>

      {/* Brand Name Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.brand ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="brand"
        >
          Brand Name
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.brand ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter Brand Name"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
        {errors.brand && (
          <p className="text-red-600 text-sm mt-1">{errors.brand}</p>
        )}
      </div>

      {/* Serial No Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.serialNo ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="serialNo"
        >
          Serial No
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.serialNo ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter Serial No"
          value={serialNo}
          onChange={(e) => setSerialNo(e.target.value)}
        />
        {errors.serialNo && (
          <p className="text-red-600 text-sm mt-1">{errors.serialNo}</p>
        )}
      </div>

      {/* Warranty Start Date Input */}
      <div className="mb-5">
        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="warrantyStartDate">
          Warranty Start Date
        </label>
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-gray-600 focus:border-red-600"
          type="date"
          placeholder="Enter Warranty Start Date"
          defaultValue={warrentyStartDate}
          onChange={(e) => setWarrentyStartDate(e.target.value === "" ? null : e.target.value)}
        />
      </div>

      {/* Warranty End Date Input */}
      <div className="mb-5">
        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="warrantyEndDate">
          Warranty End Date
        </label>
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-gray-600 focus:border-red-600"
          type="date"
          placeholder="Enter Warranty End Date"
          defaultValue={warrentyEndDate}
          onChange={(e) => setWarrentyEndDate(e.target.value === "" ? null : e.target.value)}
        />
      </div>

      {/* Price Input */}
      <div className="mb-5">
        <label
          className={`block text-sm font-medium mb-2 ${errors.price ? 'text-red-600' : 'text-gray-700'}`}
          htmlFor="price"
        >
          Price
        </label>
        <input
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 ${
            errors.price ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-gray-600'
          }`}
          type="text"
          placeholder="Enter Price (Rs.)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        {errors.price && (
          <p className="text-red-600 text-sm mt-1">{errors.price}</p>
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

    </div>
  );
};

export default ResourcesPage;

