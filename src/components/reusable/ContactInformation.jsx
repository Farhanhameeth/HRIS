import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/solid";
import { fetchEmployeeDetails, selectEmployeeDetails } from '../../features/employees/employeeDetailsSlice';

const ContactInformation = ({details}) => {
  const dispatch = useDispatch();

  const employeeDetails = useSelector(selectEmployeeDetails);
  const loading = useSelector(state => state.employeeDetails.loading);
  const error = useSelector(state => state.employeeDetails.error);

  useEffect(() => {
    dispatch(fetchEmployeeDetails());
  }, [dispatch]);

  if (loading) {
    return <p>Loading...</p>; // Display a loading message while fetching data
  }

  if (error) {
    return <p>Error: {error}</p>; // Display an error message if fetching data fails
  }

  if (!employeeDetails) {
    return <p>No data available</p>; // Handle empty or missing data
  }

  return (
    <div className="bg-white p-4 rounded-lg w-full border border-gray-300 mx-auto">
      <div className="flex mb-4">
        <ChatBubbleLeftEllipsisIcon className="h-6 w-6 text-customOrange-300 mr-2 mt-1" />
        <h2 className="text-lg font-semibold text-gray-800">Contact Information</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        {details
        .filter((detail) => detail.label === 'Email' || detail.label === 'Personal Phone No.')
        .map((detail, index) => (
          <div key={index}>
            <p className="font-medium">{detail.label}</p>
            <p>{detail.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactInformation;