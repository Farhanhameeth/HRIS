
// Ticket.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-modal';
import {
  addTicket,
  setSelectedTicket,
  setChatMessage,
  addChatMessage,
  updateTicketStatus,
  setFeedbackRating,
  fetchTickets,
  submitTicket,
  fetchTicketComments,
  submitTicketComment,
  setCurrentPage,
  setItemsPerPage,
} from '../features/tickets/ticketsSlice';

import { selectEmployeeId, selectUserId, selectDepartment } from '../features/auth/authSlice';


const Ticket = () => {
  const [TargetDepartment, setTargetDepartment] = useState('');
  const [TicketDescription, setTicketDescription] = useState('');
  const [chatMessage, setChatMessageInput] = useState(''); // Local state for chat input
  const [activeTab, setActiveTab] = useState('requests');
  const [isHR, setIsHR] = useState(true); // Change this to dynamically check if the user is HR
  const dispatch = useDispatch();
  const tickets = useSelector((state) => state.tickets.tickets);
  // const receivedGrievances = useSelector((state) => state.grievances.receivedGrievances);
  const selectedTicket = useSelector((state) => state.tickets.selectedTicket);
  const chatHistory = useSelector((state) => state.tickets.chatHistory);
  const feedbackRating = useSelector((state) => state.tickets.feedbackRating);
  const [selectedTicketForAction, setSelectedTicketForAction] = useState(null);
  const currentPage = useSelector(state => state.tickets.currentPage);
  const itemsPerPage = useSelector(state => state.tickets.itemsPerPage);
  const statusMapping = useSelector(state => state.tickets.statusMapping);

  const [errors, setErrors] = useState({});

  const employeeId = useSelector(selectEmployeeId);
  const userId = useSelector(selectUserId);
  const department = useSelector(selectDepartment);

  const hardcodedemployeeId = employeeId;
  const [darkMode] = useState(localStorage.getItem("theme") === "dark");
  
    useEffect(() => {
      if (darkMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }, [darkMode]);

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]); // Dependency array added to run only once

  const validateForm = () => {
    const newErrors = {};

    if (!TargetDepartment) newErrors.TargetDepartment = 'Target Department is required';
    if (!TicketDescription) newErrors.TicketDescription = 'Ticket Description is required';
    
    return newErrors;
  };

  const handleSubmit = () => {

    // Perform validation
  const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Stop submission if there are errors
    } else {
      setErrors({});
    }

    const newTicket = {
      employeeId: hardcodedemployeeId,
      targetDepartmentId: TargetDepartment,
      description: TicketDescription,
      // handleBy: 1, // Example handleBy value
      statusId: 1, // Example statusId value
      feedbackRating: 0, // Default feedback rating
      insertBy: userId,
    };


    try {
      const result = dispatch(submitTicket(newTicket)).unwrap();
      console.log("Ticket Record submission successful:", result);
      alert('Ticket Submitted');

    } catch (error) {
      console.error("Ticket Record submission error:", error);
    }
    
    setTicketDescription('');
    setTargetDepartment('');
  };

  // Update local state and dispatch setChatMessage to update Redux store
  const handleChatInputChange = (e) => {
    setChatMessageInput(e.target.value);
    dispatch(setChatMessage(e.target.value));
  };

  const handleChatSubmit = () => {
    console.log("Ticket ID: ", selectedTicket.Id);

    if (chatMessage.trim() !== '') {
      const newChatMessage = {
        ticketId: selectedTicket.Id,
        comment: chatMessage,
        insertBy: userId
      };
      dispatch(submitTicketComment(newChatMessage)).then(() => {
        dispatch(fetchTicketComments(selectedTicket.Id)); // Fetch updated chat history
      });
      // dispatch(submitGrievanceComment(newChatMessage));
      //   dispatch(fetchGrievanceComments(selectedGrievance.grievanceId)); // Fetch updated chat history
      
      setChatMessageInput(''); // Clear the local input state after sending
    }
  };

  const openTicketDetails = (Ticket) => {
    dispatch(setSelectedTicket(Ticket));
    dispatch(fetchTicketComments(Ticket.TicketNumber)); // Fetch chat history when opening ticket details
  };

  const closeModal = () => {
    dispatch(setSelectedTicket(null));
  };

  const handleStatusChange = (TicketNumber, statusId) => {
    dispatch(updateTicketStatus({ TicketNumber, statusId: statusId }));
  };

  const handleRatingChange = (rating) => {
    dispatch(setFeedbackRating(rating));
  };

  const formatInsertDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const filteredTickets = tickets.filter(ticket => ticket.employeeId === hardcodedemployeeId); // Added filtering logic

  const totalItems = tickets.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tickets.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => dispatch(setCurrentPage(pageNumber));

  return (
    <div className="p-4 ml-64 bg-gray-100 min-h-screen dark:bg-gray-800">
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
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2 text-red-600 dark:text-red-400">Submit Ticket</h2>
            <select
              className={`bg-white dark:bg-gray-800 dark:text-white
                block w-1/4 p-2 mb-2 border rounded-md shadow-sm focus:ring-2 ${
                errors.TargetDepartment ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-red-600'
              }`}
              value={TargetDepartment}
              onChange={(e) => setTargetDepartment(e.target.value)}
            >
              <option value="" disabled>Select Target Department</option>
              <option value="1">Technology</option>
              <option value="2">Finance</option>
              <option value="3 ">Human Resource</option>
              <option value="4">Digital Marketing</option>
              <option value="5">Innovations</option>
              <option value="6">Business Design</option>
            </select>
            {errors.TargetDepartment && (
              <div><p className="text-red-600 text-sm mt-1">{errors.TargetDepartment}</p><br /></div>
            )}
            <textarea
              className={`block w-full p-2 mb-2 border rounded-md shadow-sm focus:ring-0 bg-white dark:bg-gray-800 dark:text-white ${
                errors.TicketDescription ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 focus:ring-red-600'
              }`}                
              placeholder="Describe your Ticket"
              value={TicketDescription}
              onChange={(e) => setTicketDescription(e.target.value)}
            ></textarea>
            {errors.TicketDescription && (
              <p className="text-red-600 text-sm mt-1">{errors.TicketDescription}</p>
            )}
            <br />
            <button
              className="bg-red-600 text-white px-4 py-2 rounded mr-2"
              onClick={() => {
                // alert('Ticket Submitted');
                handleSubmit();
              }}
            >
              Submit
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          </div>
          <br />
          <div>
            <h2 className="text-lg font-bold mb-4 text-red-600">Submitted Tickets</h2>
          <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 divide-y divide-gray-200 dark:border-gray-700 dark:text-white">
<thead className="bg-gray-50 dark:bg-gray-700">
<tr>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Ticket No</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Target Department</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Description</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Date</th>
{/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Handle By</th> */}
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Status</th>
</tr>
</thead>
<tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
{filteredTickets.map((Ticket) => (
<tr key={Ticket.TicketNumber} className="cursor-pointer" onClick={() => openTicketDetails(Ticket)}>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{Ticket.Id}</td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{Ticket.targetDepartment}</td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{Ticket.description}</td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{formatInsertDate(Ticket.insertDate)}</td>
{/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Grievance.handleBy}</td> */}
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{Ticket.status}</td>
</tr>
))}
</tbody>
</table>
        
          </div>
        </div>
      )}

      {activeTab === 'responses' && (
        <div>
          <h2 className="text-lg font-bold mb-2 text-red-600">Received Tickets</h2>
          <table className="min-w-full bg-white border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-gray-50"> 
            <tr>
           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
             {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th> */}
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Department</th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
           {/* <th className="border p-2 w-1/6">Handle By</th> */}
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Set Status</th>
           </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
{currentItems.map((Ticket) => (
            <tr
              key={Ticket.TicketNumber}
              className={`cursor-pointer ${selectedTicketForAction && selectedTicketForAction.TicketNumber === Ticket.TicketNumber ? 'bg-gray-300' : ''}`}
              onDoubleClick={() => openTicketDetails(Ticket)}
            >
              <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900">{Ticket.Id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Ticket.firstName + ' ' + Ticket.lastName}</td>
              {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Grievance.department}</td> */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Ticket.targetDepartment}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Ticket.description}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatInsertDate(Ticket.insertDate)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Ticket.status}</td>

                  <td className="border p-2">
                    <select
                      className="block w-full p-2 border rounded"
                      // defaultValue={statusMapping[2]}
                      value={Ticket.statusMapping}
                      onChange={(e) => handleStatusChange(Ticket.TicketNumber, Number(e.target.value))} // Ensure the value is a number
                    >
                      {Object.keys(statusMapping).map((key) => (
                        <option key={key} value={key} >{statusMapping[key]}</option>
                      ))}
                    </select>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table><br />

          <div className="mt-4 flex justify-between">
        <div>
          <label htmlFor="itemsPerPage" className="text-sm">Items per page:</label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => dispatch(setItemsPerPage(Number(e.target.value)))}
            className="ml-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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
      )}

         {selectedTicket && (
        <div
        className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
        onClick={closeModal} // Close the modal when clicking outside
      >
        <div
          className="bg-white p-6 rounded shadow-lg w-full max-w-lg"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
            <h2 className="text-xl font-bold mb-4 text-red-600">Ticket Details</h2>
            <p><strong>Ticket No:</strong> {selectedTicket.Id}</p>
            <p><strong>Employee No:</strong> {selectedTicket.employeeId}</p>
            <p><strong>Employee Name:</strong> {selectedTicket.firstName + ' ' + selectedTicket.lastName}</p>
            <p><strong>Target Department:</strong> {selectedTicket.targetDepartment}</p>
            {/* <p><strong>Type:</strong> {selectedGrievance.grievanceType}</p> */}
            <p><strong>Description:</strong> {selectedTicket.description}</p>
            <p><strong>Date:</strong> {formatInsertDate(selectedTicket.insertDate)}</p>
            {/* <p><strong>Handle By:</strong> {selectedGrievance.handleBy}</p> */}
            {/* <p><strong>Status:</strong> {selectedGrievance.status}</p> */}
            <div className="mt-4">
              <h3 className="text-lg font-bold mb-2 text-red-600">Chat</h3>
              <div className="border p-2 mb-2 rounded h-32 overflow-y-auto">
              {/* {console.log("ROW ID: ", userId)} */}
                {chatHistory.map((chat, index) => (
                  <div key={index} className={`mb-1 ${chat.insertBy == parseInt(userId) ? 'text-right' : 'text-left'}`}>
                    {/* {console.log('chat insertBy: ', chat.insertBy, 'userId: ', userId)} */}
                    {/* <span className="bg-gray-200 p-1 rounded mb-1 inline-block">{chat.comment}</span> */}
                    <span className={`p-1 rounded mb-1 inline-block ${chat.insertBy == parseInt(userId) ? 'bg-red-600 text-white opacity-90' : 'bg-gray-200'}`}>
                      {chat.comment}
                    </span>
                  </div>
                ))}
              </div>
              <input
                className="w-full p-2 mb-2 border rounded"
                type="text"
                placeholder="Type a message"
                value={chatMessage}
                onChange={handleChatInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleChatSubmit();
                  }
                }}
              />
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleChatSubmit}
              >
                Send
              </button>
            </div>
            {activeTab === 'requests' ? (
            <div className="mt-4">
              <h3 className="text-lg font-bold mb-2 text-red-600">Feedback Rating</h3>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-8 h-8 cursor-pointer ${star <= feedbackRating ? 'text-yellow-500' : 'text-gray-400'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => handleRatingChange(star)}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.17 3.6a1 1 0 00.95.69h3.8c.97 0 1.371 1.24.588 1.81l-3.071 2.235a1 1 0 00-.364 1.118l1.17 3.6c.3.921-.755 1.688-1.54 1.118L10 13.011l-3.072 2.236c-.784.57-1.84-.197-1.54-1.118l1.17-3.6a1 1 0 00-.364-1.118L3.122 9.027c-.783-.57-.382-1.81.588-1.81h3.8a1 1 0 00.95-.69l1.17-3.6z"></path>
                  </svg>
                ))}
              </div>
            </div>
            ) : (
              ''
            )}
            <div className="flex justify-end mt-4">
            <button
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
              onClick={closeModal}
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

export default Ticket;


///////////////////////////////// ABOVE ONE IS CORRECT

