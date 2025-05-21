import React from 'react';

const SetKPIUserFeedbackComponent = ({
  kpiSet,
  handleSelfRatingChange,
  handleDepartmentRatingChange,
  startDate,
  endDate,
  selfRating,
  onSubmitFeedback,
  // Add employee name as a prop
  employeeName,
  departmentHead = "John Doe"
}) => {
  // Group KPIs by employee
  const groupedKPIs = kpiSet.reduce((acc, kpi) => {
    if (!acc[kpi.employee]) {
      acc[kpi.employee] = [];
    }
    acc[kpi.employee].push(kpi);
    return acc;
  }, {});

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      {/* Header with employee name if provided */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">
          {employeeName ? `Performance Review: ${employeeName}` : 'KPI Feedback Form'}
        </h2>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Start Date: <span className="font-medium">{startDate}</span></p>
            <p className="text-sm text-gray-600">End Date: <span className="font-medium">{endDate}</span></p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Department Head: <span className="font-medium">{departmentHead}</span></p>
            <p className="text-sm text-gray-600">In Action of Dispute: <span className="font-medium">No</span></p>
          </div>
        </div>
      </div>

      {/* If we have grouped KPIs by employee, show each employee section */}
      {Object.keys(groupedKPIs).length > 0 ? (
        Object.entries(groupedKPIs).map(([employee, employeeKPIs]) => (
          <div key={employee} className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Employee: {employee}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-6 text-left font-semibold text-gray-700">KPI</th>
                    <th className="py-3 px-6 text-left font-semibold text-gray-700">Description</th>
                    <th className="py-3 px-6 text-left font-semibold text-gray-700">Target %</th>
                    <th className="py-3 px-6 text-left font-semibold text-gray-700">Self Rating %</th>
                    <th className="py-3 px-6 text-left font-semibold text-gray-700">Reporting Person Rating %</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeKPIs.map((kpi, index) => {
                    const kpiIndex = kpiSet.findIndex(k => k === kpi);
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-3 px-6 border-t border-gray-200">{kpi.kpi}</td>
                        <td className="py-3 px-6 border-t border-gray-200">{kpi.description}</td>
                        <td className="py-3 px-6 border-t border-gray-200">{kpi.expectedPercentage}%</td>
                        <td className="py-3 px-6 border-t border-gray-200">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
                            value={kpi.selfRating || ''}
                            onChange={(e) => handleSelfRatingChange(kpiIndex, e.target.value)}
                          />
                        </td>
                        <td className="py-3 px-6 border-t border-gray-200">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
                            value={kpi.departmentRating || ''}
                            onChange={(e) => handleDepartmentRatingChange(kpiIndex, e.target.value)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-gray-100 font-semibold">
                    <td className="py-3 px-6 border-t border-gray-300" colSpan="2">Total</td>
                    <td className="py-3 px-6 border-t border-gray-300">
                      {employeeKPIs.reduce((total, kpi) => total + parseFloat(kpi.expectedPercentage || 0), 0).toFixed(2)}%
                    </td>
                    <td className="py-3 px-6 border-t border-gray-300">
                      {employeeKPIs.reduce((total, kpi) => total + parseFloat(kpi.selfRating || 0), 0).toFixed(2)}%
                    </td>
                    <td className="py-3 px-6 border-t border-gray-300">
                      {employeeKPIs.reduce((total, kpi) => total + parseFloat(kpi.departmentRating || 0), 0).toFixed(2)}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Performance visualization for this employee */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-md font-medium text-gray-700 mb-2">Performance Summary</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Target</span>
                    <span className="text-sm font-medium text-gray-700">
                      {employeeKPIs.reduce((total, kpi) => total + parseFloat(kpi.expectedPercentage || 0), 0).toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: '80%' }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Self Rating</span>
                    <span className="text-sm font-medium text-gray-700">
                      {employeeKPIs.reduce((total, kpi) => total + parseFloat(kpi.selfRating || 0), 0).toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min(100, employeeKPIs.reduce((total, kpi) => total + parseFloat(kpi.selfRating || 0), 0))}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Report Person Rating (%)</span>
                    <span className="text-sm font-medium text-gray-700">
                      {employeeKPIs.reduce((total, kpi) => total + parseFloat(kpi.departmentRating || 0), 0).toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min(100, employeeKPIs.reduce((total, kpi) => total + parseFloat(kpi.departmentRating || 0), 0))}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        // Fallback to original table if grouping doesn't work
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-6 text-left font-semibold text-gray-700">Employee</th>
                <th className="py-3 px-6 text-left font-semibold text-gray-700">KPI</th>
                <th className="py-3 px-6 text-left font-semibold text-gray-700">Target %</th>
                <th className="py-3 px-6 text-left font-semibold text-gray-700">Self Rating %</th>
                <th className="py-3 px-6 text-left font-semibold text-gray-700">Reporting Person Rating %</th>
              </tr>
            </thead>
            <tbody>
              {kpiSet.map((kpi, index) => (
                <tr key={index} className="bg-white hover:bg-gray-50">
                  <td className="py-3 px-6 border-t border-gray-200">{kpi.employee || 'N/A'}</td>
                  <td className="py-3 px-6 border-t border-gray-200">{kpi.kpi}</td>
                  <td className="py-3 px-6 border-t border-gray-200">{kpi.expectedPercentage}%</td>
                  <td className="py-3 px-6 border-t border-gray-200">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
                      value={kpi.selfRating || ''}
                      onChange={(e) => handleSelfRatingChange(index, e.target.value)}
                    />
                  </td>
                  <td className="py-3 px-6 border-t border-gray-200">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
                      value={kpi.departmentRating || ''}
                      onChange={(e) => handleDepartmentRatingChange(index, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-semibold">
                <td className="py-3 px-6 border-t border-gray-300" colSpan="2">Total</td>
                <td className="py-3 px-6 border-t border-gray-300">
                  {kpiSet.reduce((total, kpi) => total + parseFloat(kpi.expectedPercentage || 0), 0).toFixed(2)}%
                </td>
                <td className="py-3 px-6 border-t border-gray-300">
                  {kpiSet.reduce((total, kpi) => total + parseFloat(kpi.selfRating || 0), 0).toFixed(2)}%
                </td>
                <td className="py-3 px-6 border-t border-gray-300">
                  {kpiSet.reduce((total, kpi) => total + parseFloat(kpi.departmentRating || 0), 0).toFixed(2)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Summary section */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Overall Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">KPI Percentage Total:</p>
            <p className="text-lg font-medium">
              {kpiSet.reduce((total, kpi) => total + parseFloat(kpi.expectedPercentage || 0), 0).toFixed(2)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Self Rating Total:</p>
            <p className="text-lg font-medium">
              {kpiSet.reduce((total, kpi) => total + parseFloat(kpi.selfRating || 0), 0).toFixed(2)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Reporting Person Rating Total:</p>
            <p className="text-lg font-medium">
              {kpiSet.reduce((total, kpi) => total + parseFloat(kpi.departmentRating || 0), 0).toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Comments section */}
        <div className="mt-4">
          <label htmlFor="comments" className="block text-sm font-medium text-gray-700">Additional Comments</label>
          <textarea
            id="comments"
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2"
            placeholder="Add any comments regarding this performance review..."
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end mt-6 space-x-4">
        <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300">
          Save as Draft
        </button>
        <button
          className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600"
          onClick={onSubmitFeedback}
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
};

export default SetKPIUserFeedbackComponent;