import React, { useState, useEffect } from 'react';

const KPISetComponent = ({
  kpiSet,
  employees,
  userName,
  setUserName,
  kpi,
  setKpi,
  description,
  setDescription,
  expectedPercentage,
  setExpectedPercentage,
  addKpiToGrid,
  clickedSubmitButton,
}) => {
  const [error, setError] = useState('');
  const [employeePercentages, setEmployeePercentages] = useState({});
  const [employeeNames, setEmployeeNames] = useState({});
  const [devMode, setDevMode] = useState(true); // Development mode flag

  // Calculate total percentage for each employee whenever kpiSet changes
  useEffect(() => {
    const totals = {};
    const names = {};
    
    employees.forEach(employee => {
      const employeeKpis = kpiSet.filter(item => item.employee === employee.employeeId);
      const total = employeeKpis.reduce((sum, item) => sum + Number(item.expectedPercentage), 0);
      totals[employee.employeeId] = total;
      names[employee.employeeId] = `${employee.firstName} ${employee.lastName}`;
    });
    
    setEmployeePercentages(totals);
    setEmployeeNames(names);
  }, [kpiSet, employees]);

  // Custom function to add KPI with validation
  const validateAndAddKpi = () => {
    if (!userName) {
      setError('Please select an employee');
      return false;
    }
    
    if (!kpi) {
      setError('Please enter a KPI');
      return false;
    }
    
    if (!description) {
      setError('Please enter a description');
      return false;
    }
    
    if (!expectedPercentage) {
      setError('Please set an expected percentage');
      return false;
    }
    
    // Ensure expectedPercentage is a number
    const numPercentage = Number(expectedPercentage);
    if (isNaN(numPercentage) || numPercentage <= 0) {
      setError('Please enter a valid percentage greater than 0');
      return false;
    }
    
    // Calculate current total for the selected employee
    const currentTotal = employeePercentages[userName] || 0;
    const newTotal = currentTotal + numPercentage;
    
    // Check if adding this KPI would exceed 80%
    if (newTotal > 80) {
      setError(`Total KPI percentage cannot exceed 80%. Current total: ${currentTotal.toFixed(1)}%. Maximum you can add: ${(80 - currentTotal).toFixed(1)}%`);
      return false;
    }
    
    // Clear error and proceed with adding
    setError('');
    addKpiToGrid();
    return true;
  };

  // Get remaining percentage for the current employee
  const getRemainingPercentage = () => {
    const currentTotal = employeePercentages[userName] || 0;
    return 80 - currentTotal;
  };

  // Find employee name by ID
  const getEmployeeNameById = (id) => {
    const employee = employees.find(emp => emp.employeeId === id);
    return employee ? `${employee.firstName} ${employee.lastName}` : id;
  };

  // Filter employees for display (all in production, limited in dev mode)
  const visibleEmployees = devMode ? employees.slice(0, 2) : employees;

  // Check if submit should be enabled (normal validation or dev mode with any KPIs)
  const canSubmit = () => {
    // No employees with KPIs
    if (Object.keys(employeePercentages).length === 0) {
      return false;
    }
    
    if (devMode) {
      // In dev mode, check if visible employees have exactly 80%
      const visibleEmployeeIds = visibleEmployees.map(emp => emp.employeeId);
      const filteredPercentages = Object.entries(employeePercentages)
        .filter(([id]) => visibleEmployeeIds.includes(id))
        .map(([, percentage]) => percentage);
      
      return filteredPercentages.length > 0 && filteredPercentages.every(p => Math.abs(p - 80) < 0.1);
    } else {
      // In production mode, check all employees
      return Object.values(employeePercentages).every(p => Math.abs(p - 80) < 0.1);
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-6 mx-3 bg-white shadow-lg">
      {/* Dev Mode Toggle */}
      <div className="mb-6 flex items-center justify-end">
        <label className="inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer"
            checked={devMode}
            onChange={() => setDevMode(!devMode)}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
          <span className="ms-3 text-sm font-medium text-gray-900">Dev Mode</span>
        </label>
      </div>

      {/* KPI Set Summary */}
      <div className="mb-6">
        <div className="text-lg font-semibold text-gray-800">KPI Set Summary</div>
        <div className="mt-2 text-gray-600">{`Total KPIs set: ${kpiSet.length}`}</div>
      </div>

      {/* Employee Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Select Employee</label>
        <select
          className="mt-2 w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          onChange={(e) => {
            setUserName(e.target.value);
            setError('');
          }}
          value={userName || ""}
        >
          <option value="" disabled>Select an employee</option>
          {visibleEmployees.map((employee) => (
            <option
              key={employee.employeeId}
              value={employee.employeeId}
              className={`${employeePercentages[employee.employeeId] > 0 ? 'text-green-600' : ''}`}
            >
              {employee.firstName} {employee.lastName} ({employee.employeeId}) 
              {employeePercentages[employee.employeeId] ? 
                ` (${employeePercentages[employee.employeeId].toFixed(1)}% / 80%)` : 
                ' (0% / 80%)'}
            </option>
          ))}
        </select>
      </div>

      {/* KPI Progress Bar */}
      {userName && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            KPI Allocation: {(employeePercentages[userName] || 0).toFixed(1)}% of 80% used
          </label>
          <div className="w-full h-4 bg-gray-200 rounded-full mt-2">
            <div 
              className="h-full rounded-full" 
              style={{
                width: `${(employeePercentages[userName] || 0) / 80 * 100}%`,
                background: `${(employeePercentages[userName] || 0) > 80 ? '#EF4444' : '#10B981'}`
              }}
            ></div>
          </div>
          <div className="text-sm mt-1 text-gray-600">
            Remaining: {getRemainingPercentage().toFixed(1)}%
          </div>
        </div>
      )}

      {/* KPI Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">KPI</label>
        <input
          type="text"
          className="mt-2 w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          value={kpi || ""}
          onChange={(e) => setKpi(e.target.value)}
          placeholder="Enter KPI"
        />
      </div>

      {/* Description Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          className="mt-2 w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          value={description || ""}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter KPI description"
        />
      </div>

      {/* Expected Percentage with warning */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">
          Expected Percentage: {expectedPercentage || 0}%
        </label>
        <input
          type="range"
          min="0"
          max={getRemainingPercentage() > 0 ? Math.min(100, getRemainingPercentage()) : 100}
          step="1"
          className="w-full mt-2 focus:outline-none"
          value={expectedPercentage || 0}
          onChange={(e) => setExpectedPercentage(e.target.value)}
          style={{
            background: `linear-gradient(to right, #FE5E00 ${expectedPercentage || 0}%, #F1F2F4 ${expectedPercentage || 0}%)`,
          }}
        />
        {userName && (
          <div className="text-sm mt-1 text-gray-600">
            Max suggested value: {getRemainingPercentage().toFixed(1)}%
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-end mb-6 space-x-4">
        <button
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
          onClick={() => {
            setUserName('');
            setKpi('');
            setDescription('');
            setExpectedPercentage('0');
            setError('');
          }}
        >
          Clear
        </button>
        <button
          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
          onClick={validateAndAddKpi}
        >
          Add to Grid
        </button>
      </div>

      {/* KPI Grid */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full divide-y divide-gray-200 rounded-md overflow-hidden dark:border-gray-700 shadow-md">
          <thead className="bg-gray-200 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-800 dark:text-gray-300 uppercase tracking-wider font-semibold">Employee</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">KPI</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Details</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Expected Percentage</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">End Date</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {kpiSet.length > 0 ? (
              kpiSet.map((kpi, index) => (
                <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900 dark:text-gray-300 font-semibold">
                    {getEmployeeNameById(kpi.employee)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-md text-gray-700 dark:text-gray-300">{kpi.kpi}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-md text-gray-700 dark:text-gray-300">{kpi.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-md text-gray-700 dark:text-gray-300">{kpi.expectedPercentage}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-md text-gray-700 dark:text-gray-300">{kpi.startDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-md text-gray-700 dark:text-gray-300">{kpi.endDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No KPIs set yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Employee KPI Summary */}
      {Object.keys(employeePercentages).length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium text-gray-700 mb-2">Employee KPI Allocation Summary</h3>
          <div className="space-y-2">
            {Object.entries(employeePercentages)
              .filter(([id]) => !devMode || visibleEmployees.some(emp => emp.employeeId === id))
              .map(([employeeId, percentage]) => (
                <div key={employeeId} className="flex items-center justify-between">
                  <span>{employeeNames[employeeId] || employeeId}</span>
                  <div className="flex items-center">
                    <div className="w-32 h-3 bg-gray-200 rounded-full mr-2">
                      <div 
                        className={`h-full rounded-full ${percentage > 80 ? 'bg-red-500' : percentage === 80 ? 'bg-green-500' : 'bg-orange-500'}`}
                        style={{ width: `${(percentage / 80) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm ${percentage > 80 ? 'text-red-500' : percentage === 80 ? 'text-green-500' : 'text-gray-600'}`}>
                      {percentage.toFixed(1)}% / 80%
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Dev Mode Indicator */}
      {devMode && (
        <div className="mb-6 p-2 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          <strong>Development Mode:</strong> Submit button will only validate the first 2 employees.
        </div>
      )}

      {/* Submit Button with Validation */}
      <div className="text-right">
        <button
          className={`${!canSubmit() 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-orange-500 hover:bg-orange-600'} text-white px-6 py-2 rounded-md`}
          onClick={() => {
            // Check if all employees have exactly 80% allocation and if there are any employees
            if (Object.keys(employeePercentages).length === 0) {
              setError('Please add KPIs for at least one employee before submitting.');
              return;
            }
            
            if (!canSubmit()) {
              if (devMode) {
                setError('The first two employees must have exactly 80% total KPI allocation before submitting.');
              } else {
                setError('All employees must have exactly 80% total KPI allocation before submitting.');
              }
              return;
            }
            
            clickedSubmitButton();
          }}
        >
          Submit
        </button>
      </div>
      
      {/* Submission Guidelines */}
      <div className="mt-4 text-sm text-gray-500">
        Note: {devMode ? 'In development mode, only the first two employees' : 'All employees'} must have exactly 80% KPI allocation to submit.
      </div>
    </div>
  );
};

export default KPISetComponent;