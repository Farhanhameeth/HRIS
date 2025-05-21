import { parse } from 'date-fns';
import React from 'react';

const KPIDurationSet = ({ kpiDuration, setKpiDuration, startDate, setStartDate, endDate, setEndDate, clickedProcessingButton,currentUserId }) => {

  const handleClick = async () => {
    if (!kpiDuration || !startDate || !endDate) {
      alert("❌ Please fill in all fields before starting the process.");
      return;
    }
  
    console.log("📤 Sending payload:", {
      durationId: kpiDuration,
      startDate,
      endDate,
      insertBy: parseInt(currentUserId), // ✅ ensure it's a number
    });
  
    try {
      const response = await fetch("http://localhost:5077/api/KpiTargetDetails/insertKpiDuration", {
        method: "POST",
        headers: {
          "PPA_KEY": "SvnqwrRcCGE_RSMS_KEY5xWUYcI3aLAi4=PPa",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          durationId: kpiDuration,
          startDate,
          endDate,
          insertBy: parseInt(currentUserId),
        }),
      });
  
      // ✅ Check response content type safely
      const contentType = response.headers.get("content-type");
      let result = null;
  
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = await response.text(); // fallback for string response like "Insert successful"
      }
  
      console.log("📥 Response received:", result);
  
      if (!response.ok) {
        console.error("❌ Backend Error:", result);
        alert("❌ Failed to save KPI duration.");
        return;
      }    
  
      console.log("✅ Duration saved successfully");
      clickedProcessingButton(); // move to next step
  
    } catch (error) {
      console.error("💥 Fetch error:", error);
      alert("❌ Something went wrong while saving duration.");
    }
  };
  
  

  return (
    <div className='border border-gray-300 rounded-lg p-4 m-3'>
      <div className="p-4 flex space-x-4">
        {/* KPI Duration Set Content */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">KPI Duration</label>
          <select
            className="mt-1 p-1 block w-24 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-8"
            value={kpiDuration}
            onChange={(e) => setKpiDuration(e.target.value)}
          >
            <option value="weekly">Weekly</option>
            <option value="quarterly">Quarterly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            className="mt-1 p-1 block w-28 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-8"
            value={startDate}
            min={new Date().toISOString().split("T")[0]} // sets min to today's date
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              className="mt-1 p-1 block w-28 rounded-md border border-gray-300 h-8 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
      </div>
          <div className="text-right">
          <button className="bg-customOrange-300 text-white px-4 py-2 rounded-md" onClick={handleClick}>
            Start Processing
          </button>
        </div>
    </div>
  );
};

export default KPIDurationSet;
