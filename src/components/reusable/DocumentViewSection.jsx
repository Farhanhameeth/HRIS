import React, { useState, useEffect } from "react";
import axiosInstance from "../../config/axiosConfig";

const DocumentViewSection = ({employeeRecords}) => {
  const [userDocuments, setUserDocuments] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch the saved documents from the backend
  useEffect(() => {
    if (selectedEmployeeId) {
      fetchDocuments(selectedEmployeeId);
    }
  }, [selectedEmployeeId]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/api/DocumentUpload/getDocuments', { employeeId: selectedEmployeeId });
      console.log('Documents fetch successful. Response:', response);
      setUserDocuments(response.data.documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setError("Failed to fetch documents. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle employee selection
  const handleEmployeeChange = (e) => {
    setSelectedEmployeeId(e.target.value);
  };

  const handleDownload = async (fileName) => {
    try {
      const response = await axiosInstance.get(`/api/DocumentUpload/download`, {
        params: { employeeId: selectedEmployeeId, fileName: fileName },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading file:", error);
      setError("Failed to download the file. Please try again.");
    }
  };

  return (
    <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-sm">
      <h3 className="font-semibold text-base mb-2">Your Documents</h3>

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

      {isLoading && <p className="text-sm text-gray-500">Loading documents...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!isLoading && !error && (
        <ul className="space-y-2">
          {userDocuments && userDocuments.length > 0 ? (
            userDocuments.map((doc, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-700">{doc.fileName}</span>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleDownload(doc.fileName)}
                    className="bg-customOrange-300 hover:bg-customOrange-500 text-sm text-white py-1 px-3 rounded-lg"
                  >
                    Download
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-500">No documents available for this employee.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default DocumentViewSection;
