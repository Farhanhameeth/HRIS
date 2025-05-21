import React from 'react';

const KpiIntroduction = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mt-3 mr-5">
      <h1 className="text-xl font-bold text-gray-800 mb-4">What is a KPI?</h1>
      <p className="text-gray-600 text-md mb-4">
        A Key Performance Indicator (KPI) is a measurable value that demonstrates how effectively a company is achieving key business objectives. Organizations use KPIs at multiple levels to evaluate their success in reaching targets.
      </p>

      <h2 className="text-xl font-semibold text-gray-700 mb-2">How is KPI Measured?</h2>
      <p className="text-gray-600 text-md mb-6">
        KPIs are measured by defining specific goals, collecting data, and evaluating performance against those goals. KPIs can be calculated based on time frames, percentage targets, or other specific business metrics relevant to the department or company objectives.
      </p>

      <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
        <h3 className="text-md font-semibold text-blue-700 mb-2">Examples of Common KPIs:</h3>
        <ul className="list-disc list-inside text-blue-600">
          <li>Revenue Growth Rate</li>
          <li>Customer Retention Rate</li>
          <li>Employee Satisfaction Score</li>
          <li>Net Profit Margin</li>
        </ul>
      </div>
    </div>
  );
};

export default KpiIntroduction;
