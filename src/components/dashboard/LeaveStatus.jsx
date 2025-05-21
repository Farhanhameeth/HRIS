
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom'; 
import Modal from 'react-modal';
import {
  addLeave,
  setSelectedLeave,
  updateLeaveStatus,
  fetchLeaves,
  getVisualLeaveData,
  fetchAllEmployees,
  fetchAllLeaveTypes,
  submitLeave,
  sendEmail,
  setIsModalOpen,
  setCurrentPage,
  setItemsPerPage,
} from '../../features/leave/leaveSlice';
import { selectEmployeeId, selectUserId, selectDepartment, selectRole, selectEmail } from '../../features/auth/authSlice';
import axiosInstance from '../../config/axiosConfig';

const EmployeeLeaveDashboard = () => {
  const location = useLocation();
  //const [leaveType, setLeaveType] = useState('');
  const [leaveDateFrom, setLeaveDateFrom] = useState('');
  const [leaveDateTo, setLeaveDateTo] = useState('');
  const [leaveFirstHalf, setLeaveFirstHalf] = useState(false);
  const [leaveSecondHalf, setLeaveSecondHalf] = useState(false);
  //const [leaveAppointPerson, setLeaveAppointPerson] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [activeTab, setActiveTab] = useState('requests');
  const [isHR, setIsHR] = useState(true); // Dynamically set this based on user role
  const dispatch = useDispatch();
  const leaves = useSelector((state) => state.leave.leaves);
  const selectedLeave = useSelector((state) => state.leave.selectedLeave);
  const error = useSelector(state => state.leave.error);
  const status = useSelector(state => state.leave.status);
  const currentPage = useSelector((state) => state.leave.currentPage);
  const itemsPerPage = useSelector((state) => state.leave.itemsPerPage);
  const isModalOpen = useSelector(state => state.leave.isModalOpen);
  const [selectedLeaveForAction, setSelectedLeaveForAction] = useState(null);
  const statusMapping = useSelector(state => state.leave.statusMapping);

  const leaveTypes = useSelector((state) => state.leave.leaveTypes); // Adjust this according to your Redux state structure
  const [selectedLeaveType, setSelectedLeaveType] = useState('');

  const leaveCount = useSelector((state) => state.leave.leaveCount); 
  const [remainingLeaveCount, setRemainingLeaveCount] = useState(null);

  const employees = useSelector((state) => state.leave.employees); // Adjust this according to your Redux state structure
  const [selectedEmployee, setSelectedEmployee] = useState('');

  const employeeId = useSelector(selectEmployeeId);
  const userId = useSelector(selectUserId);
  const department = useSelector(selectDepartment);
  const role = useSelector(selectRole);
  //const email = useSelector(selectEmail);

  const [isHalfDay, setIsHalfDay] = useState(false); // Track if "Is half day?" is selected


  const [errors, setErrors] = useState({});

  const hardcodedemployeeId = employeeId;

  //console.log("EmployeeId : ", employeeId);
  //console.log("UserId : ", userId);
 // console.log("Department : ", department);
 // console.log("Role : ", role);
  //console.log("Email : ", email);

  useEffect(() => {
    if (location.hash) {
      const targetElement = document.getElementById(location.hash.substring(1)); // Remove `#`
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  useEffect(() => {
    dispatch(fetchLeaves());
    dispatch(fetchAllEmployees());
    dispatch(fetchAllLeaveTypes());
    dispatch(getVisualLeaveData(employeeId));

  }, [dispatch]);

  //dark mode
  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
    

  

  const validateForm = () => {
    const newErrors = {};

    if (!selectedLeaveType) newErrors.selectedLeaveType = 'Leave Type is required';
    if (!selectedEmployee) newErrors.selectedEmployee = 'Appoint Person is required';
   // if (!leaveAppointPerson) newErrors.leaveAppointPerson = 'Appoint Person is required';
    if (!leaveDateFrom) newErrors.leaveDateFrom = 'Leave Date is required';
    if (!leaveDateTo) newErrors.leaveDateTo = 'Leave Date is required';
    if (!leaveReason) newErrors.leaveReason = 'Leave Reason is required';
   

    return newErrors;
  };

  // Handle checkbox change for "Is half day?"
  const handleHalfDayChange = (e) => {
    setIsHalfDay(e.target.checked); // Update isHalfDay based on checkbox
  };

  // Function to send the email to the leave requester
  const sendEmailFunc = async (leaverEmail, status) => {
    const subject = `Leave Status Update: Your leave has been ${status}`;
    const message = `Dear Employee,\n\nYour leave has been ${status}.\n\nBest Regards,\nHR Team`;
    const sender = "HR Team";

    const newEmail = {
      recipientEmail: leaverEmail,
      subject: subject,
      message: message,
      sender : sender,
    };
console.log("recipientEmail", leaverEmail);
console.log("subject", subject);
console.log("message", message);
console.log("sender", sender);

    // Dispatch the submitLeave action and log the result
    try {
      const result = await dispatch(sendEmail(newEmail)).unwrap();
      console.log("Email submission successful:", result);
      alert("Leave request has been updated successfully");
    } catch (error) {
      console.error("Email submission error:", error);
    }
  };


    // A helper function to confirm the status change
    const confirmStatusChange = (leaveId, status, employeeId, leaverEmail) => {
      let confirmationMessage = '';
  
      // Customize confirmation message based on status
      if (status === 'approved') {
        confirmationMessage = "Are you sure you want to approve this leave?";
      } else if (status === 'rejected') {
        confirmationMessage = "Are you sure you want to reject this leave?";
      } else {
        confirmationMessage = "Are you sure you want to change the status?";
      }
  
      // Show confirmation dialog
      if (window.confirm(confirmationMessage)) {
        handleStatusChange(leaveId, status, employeeId); // Call the function if user confirms
        // Send an email after confirming the status change
        sendEmailFunc(leaverEmail, status);      }
    };

  const handleRadioChange = (event) => {
    console.log(employeeId);
    const { value } = event.target;
    if (value === "firstHalf") {
      setLeaveFirstHalf(true);
      setLeaveSecondHalf(false);
    } else if (value === "secondHalf") {
      setLeaveFirstHalf(false);
      setLeaveSecondHalf(true);
    }
  };
  

  const handleEmployeeChange = (event) => {
    const selectedName = event.target.value;
    setSelectedEmployee(selectedName);
  };

  const handleLeaveTypeChange = (event) => {
    const selectedLT = event.target.value;
    setSelectedLeaveType(selectedLT);

    // Find the corresponding leave type in leaveCount array
    const selectedLeaveData = leaveCount.find(
      (leave) => leave.type === selectedLT
    );

    if (selectedLeaveData) {
      // Calculate remaining leave count (dateCount - TotalLeaveDays)
      const remainingCount = selectedLeaveData.dateCount - selectedLeaveData.TotalLeaveDays;
      setRemainingLeaveCount(remainingCount);
    } else {
      // If no data found for the selected leave type, reset the count
      setRemainingLeaveCount(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    // Perform validation
    const newErrors = validateForm();
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Stop submission if there are errors
    } else {
      setErrors({});
    }
    if (remainingLeaveCount > 0){
    const newLeave = {
      employeeId: hardcodedemployeeId,
      leaveType: selectedLeaveType,
      dateFrom: leaveDateFrom,
      dateTo: leaveDateTo,
      isFirstHalf: leaveFirstHalf,
      isSecondHalf: leaveSecondHalf,
      appointPerson: selectedEmployee,
      leaveReason: leaveReason,
      insertBy: userId,
    };

    // Dispatch the submitLeave action and log the result
    try {
      const result = await dispatch(submitLeave(newLeave)).unwrap();
      console.log("Leave submission successful:", result);
      alert("Leave Submitted Successfully");
    } catch (error) {
      console.error("Leave submission error:", error);
    }
  }
  else {
    alert('Sorry! No remaining leaves');
  }
    setSelectedLeaveType('');
    setLeaveReason('');
    setLeaveDateFrom('');
    setLeaveDateTo('');
   // setLeaveAppointPerson('');
    setSelectedEmployee('');
    setLeaveFirstHalf(false);
    setLeaveSecondHalf(false);
  };

  const openLeaveDetails = (leave) => {
    dispatch(setIsModalOpen(true));
    dispatch(setSelectedLeave(leave));
  };

  const closeModal = () => {
    dispatch(setIsModalOpen(false));
    dispatch(setSelectedLeave(null));
  };

  const handleStatusChange = (Id, status, user) => {
    dispatch(updateLeaveStatus({ Id, status: status, user: hardcodedemployeeId }));
  };


  const formatInsertDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  const filteredLeaves = leaves.filter(leave => leave.employeeId === hardcodedemployeeId);

  const totalItems = leaves.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = leaves.slice(indexOfFirstItem, indexOfLastItem);
  

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => dispatch(setCurrentPage(pageNumber));

  return (
    <div className="p-4 ml-64 min-h-screen bg-gray-50 dark:bg-gray-900 ">
     {department == 'Human Resource' ? 
      <div className="flex justify-center mb-4">
        <button
          className={`px-4 py-2 ${activeTab === 'requests' ? 'bg-red-600 text-white' : 'bg-gray-200'} rounded mr-2`}
          onClick={() => setActiveTab('requests')}
        >
          Requests
        </button>
        {isHR && (
          <button
            className={`px-4 py-2 ${activeTab === 'responses' ? 'bg-red-600 text-white' : 'bg-gray-200'} rounded`}
            onClick={() => setActiveTab('responses')}
          >
            Responses
          </button>
        )}
      </div> : <div><br /></div>}

      {activeTab === 'requests' && (
        <div>
          <div id="requestLeave">
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2 text-red-600 dark:text-red-400">Request Leave</h2>
          </div>
            <div className="flex items-center">
            <select
  value={selectedLeaveType}
  onChange={handleLeaveTypeChange}
  className={`block w-1/4 p-2 mb-2 border rounded-md shadow-sm focus:ring-2 transition-all
    ${
      errors.selectedLeaveType
        ? 'border-red-600 focus:ring-red-600'
        : 'border-gray-300 focus:ring-gray-600 dark:border-gray-600 dark:focus:ring-gray-400'
    }
    bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100
  `}
  style={{ height: '40px' }} // Ensures consistent height
>
  <option value="" disabled>Select Leave Type</option>
  {leaveTypes.map((leaveType) => (
    <option key={leaveType.leaveType} value={leaveType.leaveType}>
      {leaveType.leaveType}
    </option>
  ))}
</select>


          {/* Remaining Leave Count displayed in a box next to the dropdown */}
          {selectedLeaveType && remainingLeaveCount !== null && (
            <div 
              className="ml-4 p-2 border rounded-md shadow-sm bg-#3B3B3D border-none" 
              style={{
                width: '150px', 
                height: '40px', 
                display: 'flex', 
                alignItems: 'center', 
                position: 'relative', 
                top: '-5px' // This moves the box 5px higher
              }}
            >
              <label className="text-green-700 text-center text-xl" style={{ margin: '0 auto' }}>
                {remainingLeaveCount} Remaining
              </label>
            </div>
          )}

          {errors.selectedLeaveType && (
              <p className="text-red-600 text-sm mt-1">{errors.selectedLeaveType}</p>
            )}
           {/* <br /> */}
           </div>

           <select
  defaultValue={selectedEmployee}
  onChange={handleEmployeeChange}
  className={`block w-1/4 p-2 mb-2 border rounded-md shadow-sm focus:ring-2 transition-all
    ${
      errors.selectedEmployee
        ? 'border-red-600 focus:ring-red-600'
        : 'border-gray-300 focus:ring-gray-600 dark:border-gray-600 dark:focus:ring-gray-400'
    }
    bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100
  `}
>
  <option value="" disabled>Select Appoint Person</option>
  {employees.map((employee) => (
    <option key={employee.name} value={employee.name}>
      {employee.name}
    </option>
  ))}
</select>

          {errors.selectedEmployee && (
              <p className="text-red-600 text-sm mt-1">{errors.selectedEmployee}</p>
            )}
           <br />
            <div className="flex space-x-4 mb-2">
              <div className="relative w-1/4">
                <label
                  className={`absolute left-0 -top-4 text-xs ${errors.leaveDateFrom ? 'text-red-600' : 'text-gray-500 dark:text-gray-300'}`}
                >
                  Date From
                </label>
                <input
  className={`block w-full p-2 border rounded-md shadow-sm focus:ring-2 transition-all
    ${
      errors.leaveDateFrom
        ? 'border-red-600 focus:ring-red-600'
        : 'border-gray-300 focus:ring-gray-600 dark:border-gray-600 dark:focus:ring-gray-400'
    }
    bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100
  `}
  type="date"
  value={leaveDateFrom}
  onChange={(e) => setLeaveDateFrom(e.target.value)}
/>

                {errors.leaveDateFrom && (
                <p className="text-red-600 text-sm mt-1">{errors.leaveDateFrom}</p>
              )}
              </div>
              <div className="relative w-1/4">
              <label
                  className={`absolute left-0 -top-4 text-xs ${errors.leaveDateTo ? 'text-red-600' : 'text-gray-500 dark:text-gray-300'}`}
                  >
                  Date To
                </label>
                <input
  className={`block w-full p-2 border rounded-md shadow-sm focus:ring-2 transition-all
    ${
      errors.leaveDateTo
        ? 'border-red-600 focus:ring-red-600'
        : 'border-gray-300 focus:ring-gray-600 dark:border-gray-600 dark:focus:ring-gray-400'
    }
    bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100
  `}
  type="date"
  value={leaveDateTo}
  onChange={(e) => setLeaveDateTo(e.target.value)}
/>

                {errors.leaveDateTo && (
                <p className="text-red-600 text-sm mt-1">{errors.leaveDateTo}</p>
              )}
              </div>
            </div>
           
            <textarea
  className={`block w-full p-3 mb-2 border rounded-md shadow-sm focus:ring-2 transition-all resize-none
    ${
      errors.leaveReason
        ? 'border-red-600 focus:ring-red-600'
        : 'border-gray-300 focus:ring-gray-600 dark:border-gray-600 dark:focus:ring-gray-400'
    }
    bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100
  `}
  placeholder="Reason for Leave"
  value={leaveReason}
  onChange={(e) => setLeaveReason(e.target.value)}
></textarea>

            {errors.leaveReason && (
              <p className="text-red-600 text-sm mt-1">{errors.leaveReason}</p>
            )}

{selectedLeaveType !== 'Short Leave' && (
  <>
          <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="halfDayCheckbox"
                    checked={isHalfDay}
                    onChange={handleHalfDayChange}
                    className="form-checkbox h-5 w-5 text-red-600 dark:text-red-300 checked:bg-red-600"
                  />
                  <label htmlFor="halfDayCheckbox" className="ml-2 text-gray-700 dark:text-white">
                    Is half day ?
                  </label>
                </div>
  {isHalfDay &&(
            <div className="flex items-center space-x-4 mb-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="leaveHalf"
                  value="firstHalf"
                  checked={leaveFirstHalf}
                  onChange={handleRadioChange}
                  className="form-radio h-5 w-5 text-red-600 checked:bg-red-600"
                />
                <label className="ml-2 text-gray-700 dark:text-white">First Half</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="leaveHalf"
                  value="secondHalf"
                  checked={leaveSecondHalf}
                  onChange={handleRadioChange}
                  className="form-radio h-5 w-5 text-red-600 checked:bg-red-600"
                />
                <label className="ml-2 text-gray-700 dark:text-white">Second Half</label>
              </div>
            </div>
  )}
  </>
)}

           <br />
            <button
              className="bg-red-600 text-white px-4 py-2 rounded mr-2"
              onClick={handleSubmit}
            >
              Submit 
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>

          </div>
          

          <div className="mt-12" id="leaveLogs">
          <h2 className="text-lg font-bold mb-8 text-red-600 dark:text-red-400">Leave Logs</h2>
          <div className="flex justify-center">
          <table className="w-4/5 bg-white outline outline-1 outline-gray-200  dark:border-gray-500 divide-y divide-gray-300 dark:divide-gray-600 rounded-md overflow-hidden">

            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">ID</th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Leave Type</th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Reason</th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Leave From</th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Leave To</th>
             {/* <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">is First Half</th>
             <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">is Second Half</th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appoint Person</th> */}
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Status</th>

              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:text-gray-300 dark:bg-gray-800">
              {filteredLeaves.map((leave, index) => (
                <tr
                  key={index} 
                  className="cursor-pointer"
                  onClick={() => openLeaveDetails(leave)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{leave.Id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{leave.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{leave.leaveReason}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{formatInsertDate(leave.dateFrom)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{formatInsertDate(leave.dateTo)}</td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.isFirstHalf}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.isSecondHalf}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.appointPerson}</td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{leave.status}</td>

                </tr>
              ))}
            </tbody>
          </table>
          </div>
          </div>

          {/* <div className="flex justify-center mt-4">
            {pageNumbers.map((page) => (
              <button
                key={page}
                className={`px-3 py-1 rounded ${currentPage === page ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
                onClick={() => paginate(page)}
              >
                {page}
              </button>
            ))}
          </div> */}
        </div>
      )}

{activeTab === 'responses' && (
        <div>
          {/* <h2 className="text-lg font-bold mb-2 text-red-600">Received Leaves</h2> */}
          <div className="flex justify-center dark:text-gray-300">
          <table className="w-4/5 bg-white border border-gray-200 divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
           <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">ID</th>
              {/* <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emp No</th> */}
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Name</th>
              {/* <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th> */}
             {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th> */}
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Leave Type</th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Reason</th>
             <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">From</th>
             <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">To</th>
             {/* <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">is First Half</th>
             <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">is Second Half</th> */}
             {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appoint Person</th> */}
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Status</th>

           {/* <th className="border p-2 w-1/6">Handle By</th> */}
             {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
           </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:text-gray-300 dark:bg-gray-800">
{currentItems.map((Leave) => (
            <tr
              key={Leave.Id}
              className={`cursor-pointer ${selectedLeaveForAction && selectedLeaveForAction.Id === Leave.Id ? 'bg-gray-300' : ''}`}
              onDoubleClick={() => openLeaveDetails(Leave)}
            >
              <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{Leave.Id}</td>
              {/* <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900">{Leave.employeeId}</td> */}
              <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{Leave.firstName + ' ' + Leave.lastName}</td>
              {/* <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900">{Leave.lastName}</td> */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{Leave.type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{Leave.leaveReason}</td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{formatInsertDate(Leave.dateFrom)}</td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{formatInsertDate(Leave.dateTo)}</td>
              {/* <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900">{Leave.isFirstHalf}</td>
              <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900">{Leave.isSecondHalf}</td> */}
              {/* <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{Leave.appointPerson}</td> */}
              {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Leave.status}</td> */}

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                    <select
                      className="block w-full p-2 border rounded dark:bg-gray-800 dark:text-gray-300"
                      // defaultValue={statusMapping[2]}
                      value={Leave.status}
                      onChange={(e) =>
                        confirmStatusChange(Leave.Id, e.target.value, hardcodedemployeeId, Leave.leaverEmail)
                      }
                    >
                      {Object.keys(statusMapping).map((key) => (
                        <option key={key} value={key} >{statusMapping[key]}</option>
                      ))}
                    </select>
                  </td>
                 
                  
                </tr>
              ))}
            </tbody>
          </table></div><br />

          <div className="mt-4 flex justify-between mx-20 dark:text-gray-300">
        <div >
          <label htmlFor="itemsPerPage" className="text-sm">Items per page:</label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => dispatch(setItemsPerPage(Number(e.target.value)))}
            className="ml-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:text-gray-300"
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
                className={`px-3 py-1 rounded-md ${currentPage === number ? 'bg-gray-300' : 'bg-white'} border border-gray-300 dark:bg-gray-800 dark:text-gray-300`}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </div>
      </div>
      


        </div>
      )}


{isModalOpen && selectedLeave && (
        // Below onclick will handle clicks outside the modal
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center" onClick={closeModal} >
    {/* Below onclick will prevent the modal from closing if the click is inside the modal content */}
    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3" onClick={(e) => e.stopPropagation()}>
      <h2 className="text-lg font-medium mb-4">Leave Details</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <tbody>
          <tr>
            <td className="px-6 py-3 text-sm font-medium text-gray-900">Leave ID:</td>
            <td className="px-6 py-3 text-sm text-gray-500">{selectedLeave.Id}</td>
          </tr>
          {activeTab === 'responses'? <tr>
            <td className="px-6 py-3 text-sm font-medium text-gray-900">Employee ID:</td>
            <td className="px-6 py-3 text-sm text-gray-500">{selectedLeave.employeeId}</td>
          </tr> : '' }
          {activeTab === 'responses'? <tr>
            <td className="px-6 py-3 text-sm font-medium text-gray-900">Employee Name:</td>
            <td className="px-6 py-3 text-sm text-gray-500">{selectedLeave.firstName + ' ' + selectedLeave.lastName}</td>
          </tr> : '' }
          <tr>
            <td className="px-6 py-3 text-sm font-medium text-gray-900">Leave Type:</td>
            <td className="px-6 py-3 text-sm text-gray-500">{selectedLeave.type}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 text-sm font-medium text-gray-900">Reason:</td>
            <td className="px-6 py-3 text-sm text-gray-500">{selectedLeave.leaveReason}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 text-sm font-medium text-gray-900">Leave From:</td>
            <td className="px-6 py-3 text-sm text-gray-500">{formatInsertDate(selectedLeave.dateFrom)}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 text-sm font-medium text-gray-900">Leave To:</td>
            <td className="px-6 py-3 text-sm text-gray-500">{formatInsertDate(selectedLeave.dateTo)}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 text-sm font-medium text-gray-900">First Half:</td>
            <td className="px-6 py-3 text-sm text-gray-500">{selectedLeave.isFirstHalf ? 'Yes':'No'}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 text-sm font-medium text-gray-900">Second Half:</td>
            <td className="px-6 py-3 text-sm text-gray-500">{selectedLeave.isSecondHalf ? 'Yes':'No'}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 text-sm font-medium text-gray-900">Appoint Person:</td>
            <td className="px-6 py-3 text-sm text-gray-500">{selectedLeave.appointPerson == null ? 'null' : selectedLeave.appointPerson}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 text-sm font-medium text-gray-900">Email:</td>
            <td className="px-6 py-3 text-sm text-gray-500">{selectedLeave.leaverEmail}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 text-sm font-medium text-gray-900">Insert Date:</td>
            <td className="px-6 py-3 text-sm text-gray-500">{formatInsertDate(selectedLeave.insertDate)}</td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-end mt-4">
      
        <button
          onClick={closeModal}
          className="px-4 py-2 bg-red-600 text-white rounded-md"
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

export default EmployeeLeaveDashboard;



