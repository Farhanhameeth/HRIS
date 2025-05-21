import React, { useEffect, useState } from "react";
import axiosInstance from '../../config/axiosConfig';
import { useSelector, useDispatch } from 'react-redux';
import DocumentViewSection from "./DocumentViewSection";
import { DocumentIcon } from "@heroicons/react/24/solid";
import {
  fetchEmployeeRecords,
  selectEmployeeRecords,
} from '../../features/database/databaseSlice';

const DocumentsSection = ({ userDocuments }) => {
  const dispatch = useDispatch();
  const employeeRecords = useSelector(selectEmployeeRecords);
  const status = useSelector(state => state.database.status);
  const error = useSelector(state => state.database.error);

  // State to manage file upload
  const [fileBase64, setFileBase64] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEmployeeRecords());
    }
  }, [dispatch, status])

  const validateForm = () => {
    const errors = {};

    if (!selectedEmployeeId) {
      errors.employeeId = "Please select an employee";
    }

    if (!selectedFile) {
      errors.file = "Please select a file to upload";
    } else {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      const maxSize = 50 * 1024 * 1024; // 50MB

      if (!allowedTypes.includes(selectedFile.type)) {
        errors.file = "Invalid file type. Please upload a PDF, JPEG, or PNG file.";
      }

      if (selectedFile.size > maxSize) {
        errors.file = "File size exceeds 5MB limit.";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    setSelectedFile(file);
    setValidationErrors(prev => ({ ...prev, file: null }));

    const reader = new FileReader();

    reader.onloadend = () => {
      setFileBase64(reader.result.split(',')[1]);
    };

    if (file) {
      reader.readAsDataURL(file); 
    }
  };

  const handleFileUpload = async () => {
    try {
      if (validateForm()) {
        const response = await axiosInstance.post('api/DocumentUpload/upload', {
          fileBase64: fileBase64,
          fileName: selectedFile.name,
          employeeId: selectedEmployeeId,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  // Handle employee selection
  const handleEmployeeChange = (e) => {
    setSelectedEmployeeId(e.target.value);
  };

  return (
    <div className="pt-3 space-y-3">
      {/* Upload section */}
      <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-sm">
        <div className="flex mb-4">
            <DocumentIcon className="h-6 w-6 text-customOrange-300 mr-2" />
            <h3 className="font-semibold text-lg mb-4">Upload Document</h3>
        </div>

        {/* Dropdown for Employee ID */}
        <div className="mb-4">
          <label
            htmlFor="employee"
            className="block text-sm font-medium text-gray-700"
          >
            Select Employee Id
          </label>
          <select
            id="employee"
            name="employee"
            value={selectedEmployeeId}
            onChange={handleEmployeeChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-customOrange-300"
          >
            <option value="">-- Select Employee Id --</option>
            {employeeRecords.map((employee) => (
              <option key={employee.employeeId} value={employee.employeeId}>
                {employee.employeeId} - {employee.name}
              </option>
            ))}
          </select>
        </div>

        {/* File Upload Section */}
        <div className="flex items-center space-x-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="border border-gray-300 rounded-lg p-1"
          />
          <button
            onClick={handleFileUpload}
            className="bg-customOrange-300 hover:bg-customOrange-500 text-sm text-white py-1 px-3 rounded-lg"
          >
            Upload
          </button>
        </div>
      </div>

      {/* Documents list */}
      <DocumentViewSection employeeRecords={employeeRecords}/>
    </div>
  );
};

export default DocumentsSection;