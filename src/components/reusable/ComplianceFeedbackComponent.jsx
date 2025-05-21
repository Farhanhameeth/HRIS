import React from "react";

const ComplianceFeedbackComponent = ({
  complianceSet,
  handleSelfRatingChange,
  handleDepartmentRatingChange,
  startDate,
  endDate,
  employeeData = {}, // Add employee data prop with default empty object
}) => {
  const getTotal = (field) =>
    complianceSet.reduce(
      (sum, item) => sum + parseFloat(item[field] || 0),
      0
    ).toFixed(2);

  return (
    <div className="p-4">
      {/* Employee Summary Section */}
      <div className="mb-6 bg-white border border-gray-300 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Employee Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-gray-500">Employee Name</div>
            <div className="text-base">{employeeData.name || "Not specified"}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Employee ID</div>
            <div className="text-base">{employeeData.id || "Not specified"}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Department</div>
            <div className="text-base">{employeeData.department || "Not specified"}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Position</div>
            <div className="text-base">{employeeData.position || "Not specified"}</div>
          </div>
          <div className="md:col-span-2">
            <div className="text-sm font-medium text-gray-500">Comments</div>
            <div className="text-base">{employeeData.comments || "No comments available"}</div>
          </div>
        </div>
      </div>

      {/* Compliance Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-6 text-left font-semibold text-gray-700">Compliance</th>
              <th className="py-3 px-6 text-left font-semibold text-gray-700">Expected %</th>
              <th className="py-3 px-6 text-left font-semibold text-gray-700">Self Rating (%)</th>
              <th className="py-3 px-6 text-left font-semibold text-gray-700">Department Rating (%)</th>
            </tr>
          </thead>
          <tbody>
            {complianceSet.map((item, index) => (
              <tr key={index} className="bg-white hover:bg-gray-50">
                <td className="py-3 px-6 border-t border-gray-200">{item.compliance}</td>
                <td className="py-3 px-6 border-t border-gray-200">{item.expectedPercentage}</td>
                <td className="py-3 px-6 border-t border-gray-200">
                  <input
                    type="number"
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                    value={item.selfRating || ""}
                    onChange={(e) =>
                      handleSelfRatingChange(index, e.target.value, "compliance")
                    }
                  />
                </td>
                <td className="py-3 px-6 border-t border-gray-200">
                  <input
                    type="number"
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                    value={item.departmentRating || ""}
                    onChange={(e) =>
                      handleDepartmentRatingChange(index, e.target.value, "compliance")
                    }
                  />
                </td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-semibold">
              <td className="py-3 px-6 border-t border-gray-300">Total</td>
              <td className="py-3 px-6 border-t border-gray-300">
                {getTotal("expectedPercentage")}
              </td>
              <td className="py-3 px-6 border-t border-gray-300">
                {getTotal("selfRating")}
              </td>
              <td className="py-3 px-6 border-t border-gray-300">
                {getTotal("departmentRating")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Duration Information */}
      <div className="mt-4 bg-white border border-gray-300 rounded-lg p-4">
        <h3 className="text-md font-medium text-gray-700 mb-2">Review Period</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-gray-500">Start Date</div>
            <div className="text-base">{startDate}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">End Date</div>
            <div className="text-base">{endDate}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceFeedbackComponent;