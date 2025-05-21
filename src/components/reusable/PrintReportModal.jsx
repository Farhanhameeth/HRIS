import React, { forwardRef } from 'react';

const PrintReportModal = forwardRef(
  ({ employeeDetails, kpiSet, employeeComplianceMap = {}, startDate, endDate, employees = [] }, ref) => {
    return (
      <div ref={ref} id="print-section" className="print:block hidden p-8 text-sm text-black bg-white">
        {/* Header */}
        <h2 className="text-2xl font-bold text-center mb-6">KPI Management Summary Report</h2>

        {/* Reporting Person Details */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2 border-b border-gray-300 pb-1">Reporting Person Details</h3>
          <ul className="ml-4 space-y-1">
            {employeeDetails.map((item, idx) => (
              <li key={idx}><strong>{item.label}:</strong> {item.value}</li>
            ))}
          </ul>
        </section>

        {/* For Each Employee */}
        {employees.map((emp, empIndex) => {
          const empKpis = kpiSet.filter(k => k.employee === emp.employeeId);
          const empCompliance = employeeComplianceMap[emp.employeeId] || [];

          const kpiAchieved = empKpis.reduce((sum, k) => sum + parseFloat(k.departmentRating || 0), 0);
          const kpiTarget = empKpis.reduce((sum, k) => sum + parseFloat(k.expectedPercentage || 0), 0);

          const complianceAchieved = empCompliance.reduce((sum, c) => sum + parseFloat(c.departmentRating || 0), 0);
          const complianceTarget = empCompliance.reduce((sum, c) => sum + parseFloat(c.expectedPercentage || 0), 0);

          const finalScore = (kpiAchieved + complianceAchieved).toFixed(2);

          return (
            <section key={empIndex} className="mb-10">
              <h3 className="text-lg font-bold text-orange-700 mb-3">
                Employee: {emp.firstName} {emp.lastName} ({emp.employeeId})
              </h3>

              {/* KPI Table */}
              <h4 className="text-md font-semibold mb-1">KPI Summary</h4>
              <table className="w-full border border-collapse border-gray-400 text-sm mb-4">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">Employee ID</th>
                    <th className="border px-2 py-1">KPI</th>
                    <th className="border px-2 py-1">Description</th>
                    <th className="border px-2 py-1">Target %</th>
                    <th className="border px-2 py-1">Achieved %</th>
                  </tr>
                </thead>
                <tbody>
                  {empKpis.length > 0 ? (
                    empKpis.map((kpi, i) => (
                      <tr key={i}>
                        <td className="border px-2 py-1">{kpi.employee}</td>
                        <td className="border px-2 py-1">{kpi.kpi}</td>
                        <td className="border px-2 py-1">{kpi.description}</td>
                        <td className="border px-2 py-1">{kpi.expectedPercentage}%</td>
                        <td className="border px-2 py-1">{kpi.departmentRating || 0}%</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-2">No KPI data</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Compliance Table */}
              <h4 className="text-md font-semibold mb-1">Compliance Summary</h4>
              <table className="w-full border border-collapse border-gray-400 text-sm mb-4">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">Compliance</th>
                    <th className="border px-2 py-1">Target %</th>
                    <th className="border px-2 py-1">Achieved %</th>
                  </tr>
                </thead>
                <tbody>
                  {empCompliance.length > 0 ? (
                    empCompliance.map((c, i) => (
                      <tr key={i}>
                        <td className="border px-2 py-1">{c.compliance}</td>
                        <td className="border px-2 py-1">{c.expectedPercentage}%</td>
                        <td className="border px-2 py-1">{c.departmentRating || 0}%</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-2">No Compliance data</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Final Score */}
              <div className="text-right mt-2">
                <span className="font-semibold">Final Score (KPI + Compliance):</span>{' '}
                <span className="text-lg font-bold text-green-700">{finalScore} / 100</span>
              </div>
            </section>
          );
        })}

        {/* Footer */}
        <div className="text-sm text-gray-700 mt-6">
          <strong>Review Period:</strong> {startDate} to {endDate}
        </div>
      </div>
    );
  }
);

export default PrintReportModal;
