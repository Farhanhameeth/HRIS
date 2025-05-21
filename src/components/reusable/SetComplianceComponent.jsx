import React, { useState, useEffect } from 'react';

const SetComplianceComponent = ({
  compliance,
  setCompliance,
  kpiStartDate,
  kpiEndDate,
  complianceDetails,
  setComplianceDetails,
  compliancePercentage,
  setCompliancePercentage,
  complianceSet,
  addComplianceToGrid,
  onContinue,
  unitId,
  currentUserId,
}) => {
  const [totalPercentage, setTotalPercentage] = useState(0);
  const [error, setError] = useState('');

  // Calculate total percentage whenever complianceSet changes
  useEffect(() => {
    const sum = complianceSet.reduce((acc, item) => {
      return acc + (parseFloat(item.expectedPercentage) || 0);
    }, 0);
    setTotalPercentage(sum);
  }, [complianceSet]);

  const handleAddCompliance = () => {
    const missingFields = [];
    if (!compliance || compliance.trim() === '') missingFields.push('Compliance');
    if (!complianceDetails || complianceDetails.trim() === '') missingFields.push('Details');
    if (!compliancePercentage && compliancePercentage !== 0) missingFields.push('Expected Percentage');

    if (missingFields.length > 0) {
      setError(`⚠️ Please fill out the following field(s): ${missingFields.join(', ')}`);
      return;
    }

    const newPercentage = parseFloat(compliancePercentage) || 0;
    const newTotal = totalPercentage + newPercentage;

    if (newTotal > 20) {
      setError(`⚠️ Total compliance cannot exceed 20%. Current total: ${totalPercentage}%, attempting to add: ${newPercentage}%`);
      return;
    }

    setError('');
    addComplianceToGrid({
      compliance,
      details: complianceDetails,
      expectedPercentage: compliancePercentage,
      startDate: kpiStartDate,
      endDate: kpiEndDate
    });

    setCompliance('');
    setComplianceDetails('');
    setCompliancePercentage('');
  };

  const handleContinue = async () => {
    if (complianceSet.length === 0) {
      setError('⚠️ Please add at least one compliance entry before continuing.');
      return;
    }
  
    if (totalPercentage !== 20) {
      setError(`⚠️ Total compliance percentage must be exactly 20%. Current total: ${totalPercentage}%`);
      return;
    }
  
    setError('');
    
    try {
      for (const item of complianceSet) {
        const payload = {
          unitId: 1,
          description: item.details,
          targetPercentage: parseFloat(item.expectedPercentage),
          insertBy: currentUserId
        };
        
        const response = await fetch('http://localhost:5077/api/ComplianceTargetDetails/insertComplianceTargetDetails', {
          method: 'POST',
          headers: {
            'PPA_KEY': 'SvnqwrRcCGE_RSMS_KEY5xWUYcI3aLAi4=PPa',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          return response.text().then(text => {
            console.log("Error response:", text);
            throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
          });
        }
        
        const data = await response.json();
        console.log("Save result:", data);
      }
      
      // All items saved successfully
      onContinue();
    } catch (err) {
      console.error('Error in save operation:', err);
      setError(`⚠️ Failed to save compliance data: ${err.message}`);
    }
  };
  return (
    <div className="p-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Compliance</label>
        <textarea
          className="mt-1 block pl-2 pt-1 w-64 rounded-md border border-gray-300 h-8 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={compliance}
          onChange={(e) => setCompliance(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Details</label>
        <textarea
          className="mt-1 pl-2 pt-1 block w-64 rounded-md border border-gray-300 h-8 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={complianceDetails}
          onChange={(e) => setComplianceDetails(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Expected Percentage</label>
        <input
          type="number"
          className="mt-1 pl-2 block w-64 rounded-md border border-gray-300 h-8 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={compliancePercentage}
          onChange={(e) => setCompliancePercentage(e.target.value)}
        />
      </div>

      {/* Compliance total indicator */}
      <div className="flex items-center mb-4">
        <div className="text-sm text-gray-700">Current total: <span className={totalPercentage > 20 ? "text-red-500 font-bold" : "font-semibold"}>{totalPercentage}%</span> of 20%</div>
        <div className="ml-3 flex-grow">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${totalPercentage > 20 ? 'bg-red-500' : totalPercentage === 20 ? 'bg-green-500' : 'bg-blue-500'}`}
              style={{ width: `${Math.min(totalPercentage * 5, 100)}%` }} // 5x multiplier since 20% is our max
            ></div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <p className="text-sm pt-2 text-gray-500 dark:text-gray-400">
        Note: You can add multiple compliance entries. Total compliance must equal exactly 20%.
      </p>

      <div className="text-right mt-4 mb-4 space-x-2">
        <button
          className="bg-customOrange-300 text-white px-4 py-2 rounded-md"
          onClick={() => {
            setCompliance('');
            setComplianceDetails('');
            setCompliancePercentage('');
            setError('');
          }}
        >
          Clear
        </button>
        <button
          className="bg-customOrange-300 text-white px-4 py-2 rounded-md"
          onClick={handleAddCompliance}
        >
          Add to Table
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 rounded-md overflow-hidden dark:border-gray-700 shadow-md">
          <thead className="bg-gray-200 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-800 dark:text-gray-300 uppercase tracking-wider font-semibold">Compliance</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Details</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Expected Percentage</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">End Date</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {complianceSet.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No valid compliance data available.
                </td>
              </tr>
            ) : (
              complianceSet.map((compliance, index) => (
                <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900 dark:text-gray-300 font-semibold">{compliance.compliance}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-md text-gray-700 dark:text-gray-300">{compliance.details}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-md text-gray-700 dark:text-gray-300">{compliance.expectedPercentage}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-md text-gray-700 dark:text-gray-300">{compliance.startDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-md text-gray-700 dark:text-gray-300">{compliance.endDate}</td>
                </tr>
              ))
            )}
          </tbody>
          {complianceSet.length > 0 && (
            <tfoot className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <td colSpan="2" className="px-6 py-3 text-right font-medium">Total:</td>
                <td className={`px-6 py-3 font-bold ${totalPercentage === 20 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalPercentage}%
                </td>
                <td colSpan="2"></td>
              </tr>
            </tfoot>
          )}
        </table>
        
        {/* Spacer */}
        <div className="my-12" />

        {/* Button container */}
        <div className="mt-6 text-right">
          <button
            className={`${totalPercentage === 20 ? 'bg-green-600' : 'bg-gray-400'} text-white px-4 py-2 rounded-md`}
            onClick={handleContinue}
          >
            Continue to Next Step →
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetComplianceComponent;