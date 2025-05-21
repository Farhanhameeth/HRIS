import React, { useEffect, useState } from 'react';

const SetComplianceUserFeedback = ({
  setCompliance,
  startDate,
  endDate,
  submitComplianceFeedback,
  employeeComplianceMap,
  setEmployeeComplianceMap,
  employees = [],
}) => {
  // State for dev mode toggle
  const [devMode, setDevMode] = useState(false);

  // Initialize per-employee compliance feedback map
  useEffect(() => {
    if (employees.length && setCompliance.length) {
      const map = {};
      employees.forEach((emp) => {
        map[emp.employeeId] = setCompliance.map((comp) => ({
          ...comp,
          selfRating: '',
          departmentRating: '',
        }));
      });
      setEmployeeComplianceMap(map);
    }
  }, [employees, setCompliance]);

  const handleSelfRatingChange = (employeeId, index, value) => {
    setEmployeeComplianceMap((prev) => {
      const updated = [...prev[employeeId]];
      updated[index].selfRating = value;
      return { ...prev, [employeeId]: updated };
    });
  };

  const handleDepartmentRatingChange = (employeeId, index, value) => {
    setEmployeeComplianceMap((prev) => {
      const updated = [...prev[employeeId]];
      updated[index].departmentRating = value;
      return { ...prev, [employeeId]: updated };
    });
  };

  const calculateTotal = (data, field) =>
    data.reduce((sum, item) => sum + parseFloat(item[field] || 0), 0).toFixed(2);

  // Filter employees for dev mode - only show top 2 when dev mode is active
  const displayedEmployees = devMode ? employees.slice(0, 2) : employees;

  return (
    <div className="p-4 space-y-8">
      {/* Dev Mode Toggle */}
      <div className="flex items-center justify-end mb-4">
        <label htmlFor="devMode" className="inline-flex items-center cursor-pointer">
          <span className="mr-3 text-sm font-medium text-gray-700">Dev Mode</span>
          <div className="relative">
            <input 
              type="checkbox" 
              id="devMode" 
              className="sr-only" 
              checked={devMode}
              onChange={() => setDevMode(!devMode)}
            />
            <div className={`w-11 h-6 bg-gray-200 rounded-full peer ${devMode ? 'bg-orange-500' : ''}`}>
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all ${devMode ? 'translate-x-5' : ''}`}></div>
            </div>
          </div>
        </label>
      </div>

      {devMode && (
        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-4 rounded">
          <p className="font-bold">Dev Mode Active</p>
          <p>Showing only top 2 employees for testing purposes.</p>
        </div>
      )}

      {displayedEmployees.map((employee) => {
        const complianceEntries = employeeComplianceMap[employee.employeeId] || [];

        return (
          <div
            key={employee.employeeId}
            className="border border-gray-300 rounded-lg p-4 bg-white shadow"
          >
            {/* Employee Header */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {employee.firstName} {employee.lastName} ({employee.employeeId})
              </h3>
              <p className="text-sm text-gray-500">
                {employee.department || 'Department not specified'}
              </p>
            </div>

            {/* Compliance Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-3 px-6 text-left font-semibold text-gray-700">Compliance</th>
                    <th className="py-3 px-6 text-left font-semibold text-gray-700">Target %</th>
                    <th className="py-3 px-6 text-left font-semibold text-gray-700">Self Rating (%)</th>
                    <th className="py-3 px-6 text-left font-semibold text-gray-700">Dept Rating (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {complianceEntries.map((comp, index) => (
                    <tr key={index} className="bg-white hover:bg-gray-50">
                      <td className="py-3 px-6 border-t border-gray-200">{comp.compliance}</td>
                      <td className="py-3 px-6 border-t border-gray-200">{comp.expectedPercentage}</td>
                      <td className="py-3 px-6 border-t border-gray-200">
                        <input
                          type="number"
                          className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
                          value={comp.selfRating}
                          onChange={(e) =>
                            handleSelfRatingChange(employee.employeeId, index, e.target.value)
                          }
                        />
                      </td>
                      <td className="py-3 px-6 border-t border-gray-200">
                        <input
                          type="number"
                          className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
                          value={comp.departmentRating}
                          onChange={(e) =>
                            handleDepartmentRatingChange(employee.employeeId, index, e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-semibold">
                    <td className="py-3 px-6 border-t border-gray-300">Total</td>
                    <td className="py-3 px-6 border-t border-gray-300">
                      {calculateTotal(complianceEntries, 'expectedPercentage')}
                    </td>
                    <td className="py-3 px-6 border-t border-gray-300">
                      {calculateTotal(complianceEntries, 'selfRating')}
                    </td>
                    <td className="py-3 px-6 border-t border-gray-300">
                      {calculateTotal(complianceEntries, 'departmentRating')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Review Info */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-base text-gray-700">Start Date: {startDate}</div>
              <div className="text-base text-gray-700">End Date: {endDate}</div>
            </div>
          </div>
        );
      })}

      {/* Employee Count Info */}
      <div className="text-sm text-gray-500">
        Showing {displayedEmployees.length} of {employees.length} employees
      </div>

      {/* Final Submit Button */}
      <div className="text-right mt-6">
        <button
          onClick={submitComplianceFeedback}
          className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default SetComplianceUserFeedback;