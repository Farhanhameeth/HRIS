
// Grievance.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-modal';
import {
  addGrievance,
  setSelectedGrievance,
  setChatMessage,
  addChatMessage,
  updateGrievanceStatus,
  setFeedbackRating,
  fetchGrievances,
  submitGrievance,
  fetchGrievanceComments,
  submitGrievanceComment,
  setCurrentPage,
  setItemsPerPage,
} from '../features/grievances/grievancesSlice';
import { selectEmployeeId, selectUserId, selectDepartment } from '../features/auth/authSlice';

const Grievance = () => {
  const [GrievanceType, setGrievanceType] = useState('');
  const [GrievanceDescription, setGrievanceDescription] = useState('');
  const [chatMessage, setChatMessageInput] = useState(''); // Local state for chat input
  const [activeTab, setActiveTab] = useState('requests');
  const [isHR, setIsHR] = useState(true); // Change this to dynamically check if the user is HR
  const dispatch = useDispatch();
  const grievances = useSelector((state) => state.grievances.grievances);
  const receivedGrievances = useSelector((state) => state.grievances.receivedGrievances);
  const selectedGrievance = useSelector((state) => state.grievances.selectedGrievance);
  const chatHistory = useSelector((state) => state.grievances.chatHistory);
  const feedbackRating = useSelector((state) => state.grievances.feedbackRating);
  const [selectedGrievanceForAction, setSelectedGrievanceForAction] = useState(null);
  const currentPage = useSelector(state => state.grievances.currentPage);
  const itemsPerPage = useSelector(state => state.grievances.itemsPerPage);
  const statusMapping = useSelector(state => state.grievances.statusMapping);
  const [errors, setErrors] = useState({});
  const employeeId = useSelector(selectEmployeeId);
  const userId = useSelector(selectUserId);
  const department = useSelector(selectDepartment);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  const hardcodedemployeeId = employeeId;

  
  useEffect(() => {
    dispatch(fetchGrievances());
  }, [dispatch]);
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const validateForm = () => {
    const newErrors = {};
    if (!GrievanceType) newErrors.GrievanceType = 'Grievance Type is required';
    if (!GrievanceDescription) newErrors.GrievanceDescription = 'Grievance Description is required';
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    } else {
      setErrors({});
    }

    const newGrievance = {
      employeeId: hardcodedemployeeId,
      typeId: GrievanceType,
      description: GrievanceDescription,
      handleBy: 1,
      statusId: 1,
      feedbackRating: 0,
      insertBy: userId,
    };

    try {
      const result = dispatch(submitGrievance(newGrievance)).unwrap();
      console.log("Grievance Record submission successful:", result);
      alert('Grievance Submitted');
    } catch (error) {
      console.error("Grievance Record submission error:", error);
    }

    setGrievanceDescription('');
    setGrievanceType('');
  };

  // Update local state and dispatch setChatMessage to update Redux store
  const handleChatInputChange = (e) => {
    setChatMessageInput(e.target.value);
    dispatch(setChatMessage(e.target.value));
  };

  const handleChatSubmit = () => {
    console.log("Grievance ID: ", selectedGrievance.Id);

    if (chatMessage.trim() !== '') {
      const newChatMessage = {
        grievanceId: selectedGrievance.Id,
        comment: chatMessage,
        insertBy: userId
      };
      dispatch(submitGrievanceComment(newChatMessage)).then(() => {
        dispatch(fetchGrievanceComments(selectedGrievance.Id)); // Fetch updated chat history
      });
      // dispatch(submitGrievanceComment(newChatMessage));
      //   dispatch(fetchGrievanceComments(selectedGrievance.grievanceId)); // Fetch updated chat history
      
      setChatMessageInput(''); // Clear the local input state after sending
    }
  };

  const openGrievanceDetails = (Grievance) => {
    dispatch(setSelectedGrievance(Grievance));
    dispatch(fetchGrievanceComments(Grievance.GrievanceNumber)); // Fetch chat history when opening grievance details
  };

  const closeModal = () => {
    dispatch(setSelectedGrievance(null));
  };

  const handleStatusChange = (GrievanceNumber, statusId) => {
    dispatch(updateGrievanceStatus({ GrievanceNumber, statusId: statusId }));
  };

  const handleRatingChange = (rating) => {
    dispatch(setFeedbackRating(rating));
  };

  const formatInsertDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const filteredGrievances = grievances.filter(grievance => grievance.employeeId === hardcodedemployeeId);

  const totalItems = grievances.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = grievances.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => dispatch(setCurrentPage(pageNumber));

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
    <div className="p-4 ml-64">
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
          <div className="mb-4 bg-white dark:bg-gray-800 dark:text-gray-200 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-2 text-red-600 dark:text-red-400">Submit Grievance</h2>
          <select
        className={`block w-1/4 p-2 mb-2 border rounded-md shadow-sm focus:ring-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
          errors.GrievanceType ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 dark:border-gray-600 focus:ring-red-600'
        }`}
        value={GrievanceType}
        onChange={(e) => setGrievanceType(e.target.value)}
      >
              <option value="" disabled>Select Grievance Type</option>
              <option value="1">Workplace Harassment</option>
              <option value="2">Discrimination</option>
              <option value="3 ">Unfair Treatment</option>
              <option value="4">Salary Discrepancies</option>
              <option value="5">Unsafe Working Conditions</option>
              <option value="6">Workload Issues</option>
              <option value="7">Lack of Resources</option>
              <option value="8">Policy Violations</option>
              <option value="9">Bullying</option>
              <option value="10">Unprofessional Behavior</option>
            </select>
            {errors.GrievanceType && (
              <div><p className="text-red-600 text-sm mt-1">{errors.GrievanceType}</p><br /></div>
            )}
               <textarea
        className={`block w-full p-2 mb-2 border rounded-md shadow-sm focus:ring-0 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
          errors.GrievanceDescription ? 'border-red-600 focus:ring-red-600' : 'border-gray-300 dark:border-gray-600 focus:ring-red-600'
        }`}  
        placeholder="Describe your Grievance"
        value={GrievanceDescription}
        onChange={(e) => setGrievanceDescription(e.target.value)}
      ></textarea>
            {errors.GrievanceDescription && (
              <p className="text-red-600 text-sm mt-1">{errors.GrievanceDescription}</p>
            )}
            <br />
            <button
              className="bg-red-600 text-white px-4 py-2 rounded mr-2"
              onClick={() => {
                // alert('Grievance Submitted');
                handleSubmit();
              }}
            >
              Submit
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          </div>
          <br />
          <div>
    <h2 className="text-lg font-bold mb-4 text-red-600 dark:text-red-400">Submitted Grievances</h2>
            <div className="flex justify-center">
          <table className="min-w-full bg-white border border-gray-200 divide-y divide-gray-200">
<thead className="bg-gray-50 dark:bg-gray-800">
<tr>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">ID</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Grievance Type</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Description</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Date</th>
{/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Handle By</th> */}
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Status</th>
</tr>
</thead>
<tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
{filteredGrievances.map((Grievance) => (
<tr key={Grievance.GrievanceNumber} className="cursor-pointer" onClick={() => openGrievanceDetails(Grievance)}>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{Grievance.GrievanceNumber}</td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{Grievance.grievanceType}</td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{Grievance.description}</td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{formatInsertDate(Grievance.insertDate)}</td>
{/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Grievance.handleBy}</td> */}
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{Grievance.status}</td>
</tr>
))}
</tbody>
</table>
</div>

          </div>
        </div>
      )}

      {activeTab === 'responses' && (
        <div>
          <h2 className="text-lg font-bold mb-2 text-red-600">Received Grievances</h2>
          <table className="min-w-full bg-white border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-gray-50"> 
            <tr>
           <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grievance Type</th>
             {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th> */}
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Set Status</th>

           </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
{currentItems.map((Grievance) => (
            <tr
              key={Grievance.GrievanceNumber}
              className={`cursor-pointer ${selectedGrievanceForAction && selectedGrievanceForAction.GrievanceNumber === Grievance.GrievanceNumber ? 'bg-gray-300' : ''}`}
              onDoubleClick={() => openGrievanceDetails(Grievance)}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Grievance.Id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Grievance.firstName + ' ' + Grievance.lastName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Grievance.department}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Grievance.grievanceType}</td>
              {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Grievance.description}</td> */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatInsertDate(Grievance.insertDate)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Grievance.status}</td>


                  <td className="border p-2">
                    <select
                      className="block w-full p-2 border rounded"
                      // defaultValue={statusMapping[2]}
                      value={Grievance.statusMapping}
                      onChange={(e) => handleStatusChange(Grievance.GrievanceNumber, Number(e.target.value))} // Ensure the value is a number
                    >
                      {/* <option value="" disabled>Select Status</option> */}
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

      {selectedGrievance && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded shadow-lg w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* {console.log("YES: ", selectedGrievance.Id)} */}
            <h2 className="text-xl font-bold mb-4 text-red-600">Grievance Details</h2>
            <p><strong>Grievance No:</strong> {selectedGrievance.Id}</p>
            <p><strong>Employee No:</strong> {selectedGrievance.employeeId}</p>
            <p><strong>Employee Name:</strong> {selectedGrievance.firstName + ' ' + selectedGrievance.lastName}</p>
            {activeTab === 'responses' ? <p><strong>Department:</strong> {selectedGrievance.department}</p> : ''}
            <p><strong>Type:</strong> {selectedGrievance.grievanceType}</p>
            <p><strong>Description:</strong> {selectedGrievance.description}</p>
            <p><strong>Date:</strong> {formatInsertDate(selectedGrievance.insertDate)}</p>
            <p><strong>Handle By:</strong> {selectedGrievance.handleBy}</p>
            <div className="mt-4">
              <h3 className="text-lg font-bold mb-2 text-red-600">Chat</h3>
              <div className="border p-2 mb-2 rounded h-32 overflow-y-auto">
              {console.log("ROW ID: ", userId)}
                {chatHistory.map((chat, index) => (
                  <div key={index} className={`mb-1 ${chat.insertBy == parseInt(userId) ? 'text-right' : 'text-left'}`}>
                    {console.log('chat insertBy: ', chat.insertBy, 'userId: ', userId)}
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
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      onClick={() => handleRatingChange(star)}
                    >
                      <path d="M12 2.248c-.375 0-.734.191-.938.516l-3.03 6.052-6.676.97c-.82.12-1.148 1.145-.555 1.735l4.83 4.709-1.14 6.637c-.141.822.721 1.447 1.454 1.062l5.94-3.123 5.94 3.123c.733.385 1.595-.24 1.454-1.062l-1.14-6.637 4.83-4.709c.593-.59.266-1.615-.555-1.735l-6.676-.97-3.03-6.052c-.204-.325-.563-.516-.938-.516z" />
                    </svg>
                  ))}
                </div>
              </div>
            ) : (''
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
    </div>
    
  );
};

export default Grievance;
